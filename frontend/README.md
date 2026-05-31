# 🚀 SuperRH - Système ATS Intelligent (Projet de Fin d'Études)

SuperRH est une plateforme de recrutement (Applicant Tracking System) de nouvelle génération développée avec **Next.js** et **FastAPI**. Ce système utilise une approche hybride combinant l'analyse classique par mots-clés et l'Intelligence Artificielle (Groq / Llama 3) pour évaluer les CV de manière sémantique.

## ✨ Fonctionnalités Principales
- 🧠 **Analyse IA Profonde :** Évaluation des candidats avec le modèle Llama 3 (génération de score, points forts, faiblesses).
- 📄 **Extraction OCR Hybride :** Utilisation de `pdfplumber` avec un fallback `Tesseract OCR` pour lire même les CV scannés.
- 🔒 **Sécurité Avancée :** Authentification robuste via **JWT (JSON Web Tokens)** et mots de passe hachés.
- 📩 **Automatisation RH :** Envoi automatique d'emails personnalisés (Acceptation/Refus) via SMTP.
- 📊 **Tableau de Bord Administrateur :** Interface fluide pour gérer les offres d'emploi et suivre les candidats.

## 🛠️ Stack Technique
- **Frontend :** Next.js 14, React, Tailwind CSS, TypeScript
- **Backend :** FastAPI (Python), PostgreSQL, PyJWT
- **Intelligence Artificielle :** API Groq (Llama 3 8B)

## ⚙️ Installation (Frontend)

1. Cloner le repository
2. Installer les dépendances :
   ```bash
   npm install