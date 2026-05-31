import psycopg2
from psycopg2 import pool
import os
from dotenv import load_dotenv

load_dotenv()

_pool = None

def get_pool():
    global _pool
    if _pool is None:
        _pool = pool.SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            host=os.getenv("DB_HOST", "localhost"),
            database=os.getenv("DB_NAME", "ats_db"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "1234"),
            port=int(os.getenv("DB_PORT", "5432"))
        )
    return _pool

def get_connection():
    return get_pool().getconn()

def release_connection(conn):
    if conn:
        get_pool().putconn(conn)

def create_tables():
    conn = get_connection()
    try:
        cur = conn.cursor()

        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                nom VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                titre VARCHAR(255) NOT NULL,
                description TEXT DEFAULT '',
                competences TEXT NOT NULL,
                statut VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS candidates (
                id SERIAL PRIMARY KEY,
                nom VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                telephone VARCHAR(50) DEFAULT '',
                cv_path TEXT DEFAULT '',
                match_score FLOAT DEFAULT 0.0,
                statut VARCHAR(50) DEFAULT 'nouveau',
                job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id SERIAL PRIMARY KEY,
                candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
                job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
                statut VARCHAR(50) DEFAULT 'nouveau',
                ai_analysis TEXT DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        migrations = [
            "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'nouveau'",
            "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS match_score FLOAT DEFAULT 0.0",
            "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS cv_path TEXT DEFAULT ''",
            "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS telephone VARCHAR(50) DEFAULT ''",
            "ALTER TABLE applications ADD COLUMN IF NOT EXISTS ai_analysis TEXT DEFAULT '{}'",
            "ALTER TABLE applications ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'nouveau'",
        ]

        for migration in migrations:
            try:
                cur.execute(migration)
            except Exception as e:
                print(f"Migration skipped: {e}")
                conn.rollback()

        conn.commit()
        cur.close()
        print("✅ Tables créées avec succès")

    except Exception as e:
        conn.rollback()
        print(f"❌ Erreur: {e}")
    finally:
        release_connection(conn)