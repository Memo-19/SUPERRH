import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="ats_db",
        user="postgres",
        password="1234",
        port="5432"
    )

def create_tables():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            nom VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password VARCHAR(255),
            role VARCHAR(20)
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id SERIAL PRIMARY KEY,
            titre VARCHAR(100),
            description TEXT,
            competences TEXT,
            statut VARCHAR(20) DEFAULT 'active'
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS candidates (
            id SERIAL PRIMARY KEY,
            nom VARCHAR(100),
            email VARCHAR(100),
            telephone VARCHAR(20),
            cv_path VARCHAR(255)
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id SERIAL PRIMARY KEY,
            candidate_id INTEGER REFERENCES candidates(id),
            job_id INTEGER REFERENCES jobs(id),
            match_score FLOAT,
            statut VARCHAR(20) DEFAULT 'nouveau'
        );
    """)

    conn.commit()
    cur.close()
    conn.close()
    print("Tables créées avec succès!")