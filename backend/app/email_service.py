import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ⚠️ استخدم إيميلك والكود السري المكون من 16 حرفاً
import os
from dotenv import load_dotenv

load_dotenv()

SENDER_EMAIL = os.getenv("EMAIL_USER")
SENDER_PASSWORD = os.getenv("EMAIL_PASSWORD") 

def send_reset_code_email(to_email: str, code: str):
    msg = MIMEMultipart()
    msg['From'] = f"SuperRH Sécurité <{SENDER_EMAIL}>"
    msg['To'] = to_email
    msg['Subject'] = "🔒 Code de réinitialisation de votre mot de passe"
    
    body = f"""
    Bonjour,

    Vous avez demandé la réinitialisation de votre mot de passe sur l'espace administrateur SuperRH.
    Voici votre code de sécurité à 6 chiffres : 
    
    👉 {code} 👈
    
    Ce code est valide pour les 15 prochaines minutes. Si vous n'avez pas fait cette demande, veuillez ignorer cet email.

    Cordialement,
    L'équipe Sécurité SuperRH.
    """

    msg.attach(MIMEText(body, 'plain', 'utf-8'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Code envoyé avec succès à {to_email}")
        return True
    except Exception as e:
        print(f"❌ Erreur d'envoi: {e}")
        return False

def send_decision_email(to_email: str, candidate_name: str, status: str, job_title: str):
    msg = MIMEMultipart()
    msg['From'] = f"SuperRH ATS <{SENDER_EMAIL}>"
    msg['To'] = to_email

    if status == 'accepté':
        msg['Subject'] = f"🎉 Bonne nouvelle ! Vous êtes accepté(e) pour le poste : {job_title}"
        body = f"Bonjour {candidate_name},\n\nFélicitations ! Suite à l'analyse de votre profil par notre système d'intelligence artificielle et notre équipe RH, nous avons le plaisir de vous informer que votre candidature pour le poste de '{job_title}' a été retenue.\n\nNous vous contacterons très prochainement.\n\nCordialement,\nL'équipe SuperRH."
    else:
        msg['Subject'] = f"Mise à jour concernant votre candidature : {job_title}"
        body = f"Bonjour {candidate_name},\n\nNous vous remercions de l'intérêt que vous avez porté à notre entreprise pour le poste de '{job_title}'.\n\nMalgré la qualité de votre profil, nous avons le regret de vous informer que votre candidature n'a pas été retenue pour le moment.\n\nNous vous souhaitons une excellente continuation dans vos recherches.\n\nCordialement,\nL'équipe SuperRH."

    msg.attach(MIMEText(body, 'plain', 'utf-8'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except:
        return False