from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_match_score(cv_text: str, job_description: str) -> float:
    if not cv_text or not job_description:
        return 0.0

    vectorizer = TfidfVectorizer()
    
    tfidf_matrix = vectorizer.fit_transform([cv_text, job_description])
    
    score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    
    return round(float(score[0][0]) * 100, 2)