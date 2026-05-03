import re

STOP_WORDS = {
    "nous", "cherchons", "un", "une", "pour", "rejoindre", "notre", "equipe",
    "de", "la", "le", "les", "des", "et", "ou", "avec", "dans", "sur", "a", "à",
    "experimente", "expérimenté", "candidat", "recherche", "profil", "poste",
    "qui", "que", "est", "sont", "en", "au", "aux", "par", "vous", "votre",
    "we", "are", "looking", "for", "a", "an", "to", "join", "our", "team",
    "and", "or", "with", "in", "on", "at", "experienced", "candidate", "role",
    "the", "is", "of", "by", "you", "your", "developer"
}

def clean_text(text: str) -> set:
    if not text:
        return set()
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    words = text.split()
    meaningful_words = {word for word in words if word not in STOP_WORDS}
    return meaningful_words

def calculate_match_score(resume_text: str, job_description: str) -> float:
    if not resume_text or not job_description:
        return 0.0

    resume_skills = clean_text(resume_text)
    jd_skills = clean_text(job_description)

    print(f"CV Skills: {resume_skills}")
    print(f"JD Skills: {jd_skills}")

    if len(jd_skills) == 0:
        return 0.0

    common_skills = resume_skills.intersection(jd_skills)
    print(f"Common Skills: {common_skills}")

    score = (len(common_skills) / len(jd_skills)) * 100
    return round(score, 2)