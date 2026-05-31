import re
import os
import json
import math
from typing import Dict, Tuple
from dotenv import load_dotenv

load_dotenv()

# ─── Groq Client ─────────────────────────────────────
try:
    from groq import Groq
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
except ImportError:
    groq_client = None

# ─── STOP WORDS ───────────────────────────────────────
STOP_WORDS = {
    "le", "la", "les", "de", "du", "des", "un", "une", "et", "en",
    "au", "aux", "ce", "se", "sa", "son", "ses", "sur", "par",
    "pour", "dans", "avec", "est", "sont", "être", "avoir",
    "the", "a", "an", "of", "in", "to", "and", "or", "for", "on",
    "at", "by", "is", "are", "was", "were", "be", "has", "have",
    "with", "from", "this", "that", "will", "can", "not", "we"
}

# ─── SYNONYMES TECHNIQUES ─────────────────────────────
TECH_SYNONYMS: Dict[str, str] = {
    "js": "javascript", "nodejs": "node", "node.js": "node",
    "reactjs": "react", "react.js": "react",
    "vuejs": "vue", "vue.js": "vue",
    "nextjs": "next", "next.js": "next",
    "ts": "typescript", "py": "python",
    "drf": "django", "django-rest": "django",
    "pg": "postgresql", "postgres": "postgresql",
    "k8s": "kubernetes", "kube": "kubernetes",
    "ci/cd": "cicd", "ci-cd": "cicd",
    "tailwind": "tailwindcss",
    "sklearn": "scikit-learn", "scikit": "scikit-learn",
    "tf": "tensorflow", "keras": "tensorflow",
    "mongo": "mongodb",
    "html5": "html", "css3": "css", "scss": "css", "sass": "css",
}

# ─── POIDS PAR TECHNOLOGIE ────────────────────────────
TECH_WEIGHTS: Dict[str, float] = {
    "python": 3.0, "javascript": 3.0, "typescript": 3.0,
    "java": 3.0, "csharp": 3.0, "golang": 3.0,
    "react": 2.5, "next": 2.5, "angular": 2.5, "vue": 2.5,
    "fastapi": 2.5, "django": 2.5, "flask": 2.5, "spring": 2.5,
    "postgresql": 2.0, "mysql": 2.0, "mongodb": 2.0,
    "redis": 2.0, "elasticsearch": 2.0,
    "docker": 2.0, "kubernetes": 2.0,
    "aws": 2.0, "gcp": 2.0, "azure": 2.0, "cicd": 2.0,
    "node": 1.8, "express": 1.8, "restapi": 1.8, "graphql": 1.8,
    "tensorflow": 2.5, "pytorch": 2.5,
    "scikit-learn": 2.5, "nlp": 2.5,
    "html": 1.5, "css": 1.5, "tailwindcss": 1.5,
    "git": 1.0, "linux": 1.0, "agile": 1.0, "scrum": 1.0,
}

# ─── PREPROCESSING ────────────────────────────────────
def preprocess_text(text: str) -> set:
    if not text:
        return set()
    text = text.lower()
    text = re.sub(r'[^\w\s\.\-/]', ' ', text)
    tokens = set()
    for word in text.split():
        word = word.strip('.-/_')
        if not word or len(word) < 2 or word in STOP_WORDS:
            continue
        normalized = TECH_SYNONYMS.get(word, word)
        tokens.add(normalized)
    return tokens

# ─── SCORE CLASSIQUE (MOTS-CLÉS) ──────────────────────
def calculate_match_score(
    cv_text: str,
    job_description: str
) -> Tuple[float, dict]:

    if not cv_text or not job_description:
        return 0.0, {"matched": [], "missing": [], "bonus": 0}

    cv_tokens = preprocess_text(cv_text)
    jd_tokens = preprocess_text(job_description)

    if not jd_tokens:
        return 0.0, {"matched": [], "missing": [], "bonus": 0}

    jd_skills = {t: TECH_WEIGHTS[t] for t in jd_tokens if t in TECH_WEIGHTS}

    if not jd_skills:
        common = cv_tokens.intersection(jd_tokens)
        simple_score = min(100.0, (len(common) / len(jd_tokens)) * 100)
        return round(simple_score, 2), {
            "matched": list(common)[:10],
            "missing": [], "bonus": 0
        }

    matched_skills = {}
    missing_skills = {}

    for skill, weight in jd_skills.items():
        if skill in cv_tokens:
            matched_skills[skill] = weight
        else:
            missing_skills[skill] = weight

    total_weight = sum(jd_skills.values())
    matched_weight = sum(matched_skills.values())
    base_score = (matched_weight / total_weight) * 100 if total_weight > 0 else 0

    extra_skills = {
        t for t in cv_tokens
        if t in TECH_WEIGHTS and t not in jd_skills
    }
    bonus = min(10.0, len(extra_skills) * 1.5)
    final_score = min(100.0, base_score + bonus)

    # سلامة: تأكد ما فيش NaN
    if math.isnan(final_score) or math.isinf(final_score):
        final_score = 0.0

    return round(final_score, 2), {
        "matched": sorted(matched_skills.keys()),
        "missing": sorted(missing_skills.keys()),
        "bonus": round(bonus, 2),
        "extra_skills": sorted(list(extra_skills))[:5]
    }

# ─── SCORE IA (GROQ) ──────────────────────────────────
def analyze_cv_with_ai(cv_text: str, job_description: str) -> dict:

    score, details = calculate_match_score(cv_text, job_description)

    if not groq_client:
        return {
            **details,
            "score": score,
            "ai_score": score,
            "strengths": details.get("matched", [])[:3],
            "weaknesses": details.get("missing", [])[:3],
            "summary": "Analyse par mots-clés (IA non configurée).",
            "decision_recommandee": _get_decision(score)
        }

    prompt = f"""
Tu es un expert en recrutement IT.
Description du poste : {job_description[:800]}
CV du candidat : {cv_text[:1500]}
Score initial calculé : {score}%
Compétences trouvées : {', '.join(details.get('matched', []))}
Compétences manquantes : {', '.join(details.get('missing', []))}

Fais une analyse et retourne UNIQUEMENT ce JSON valide :
{{
    "ai_score": {score},
    "strengths": ["point fort 1", "point fort 2", "point fort 3"],
    "weaknesses": ["point faible 1", "point faible 2"],
    "summary": "Résumé en 2 phrases.",
    "decision_recommandee": "nouveau"
}}
"""

    try:
        response = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Tu réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après."
                },
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=500,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content
        ai_result = json.loads(content)

        # Score final = moyenne pondérée (60% keywords + 40% IA)
        ai_score = float(ai_result.get("ai_score", score))
        final_score = round((score * 0.6) + (ai_score * 0.4), 2)
        final_score = min(100.0, max(0.0, final_score))

        return {
            **details,
            "score": final_score,
            "ai_score": ai_score,
            "keyword_score": score,
            "strengths": ai_result.get("strengths", []),
            "weaknesses": ai_result.get("weaknesses", []),
            "summary": ai_result.get("summary", "Analyse terminée."),
            "decision_recommandee": ai_result.get(
                "decision_recommandee",
                _get_decision(final_score)
            )
        }

    except json.JSONDecodeError as e:
        print(f"❌ Erreur JSON Groq: {e}")
        return _fallback_result(score, details)

    except Exception as e:
        print(f"❌ Erreur IA Groq: {e}")
        return _fallback_result(score, details)


def _get_decision(score: float) -> str:
    if score >= 70:
        return "accepté"
    elif score >= 40:
        return "nouveau"
    else:
        return "refusé"


def _fallback_result(score: float, details: dict) -> dict:
    return {
        **details,
        "score": score,
        "ai_score": score,
        "strengths": details.get("matched", [])[:3],
        "weaknesses": details.get("missing", [])[:3],
        "summary": "Analyse par système de règles (fallback).",
        "decision_recommandee": _get_decision(score)
    }