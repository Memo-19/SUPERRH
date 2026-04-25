'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Job {
  id: number
  titre: string
  description: string
  competences: string
  statut: string
}

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: ''
  })

  useEffect(() => {
    fetch('http://127.0.0.1:8000/jobs/')
      .then(res => res.json())
      .then(data => {
        const found = data.find((j: Job) => j.id === Number(params.id))
        setJob(found || null)
        setLoading(false)
      })
  }, [params.id])

  const handleSubmit = async () => {
    if (!form.nom || !form.email || !form.telephone || !cvFile) return

    setSubmitting(true)
    const formData = new FormData()
    formData.append('nom', form.nom)
    formData.append('email', form.email)
    formData.append('telephone', form.telephone)
    formData.append('job_id', String(params.id))
    formData.append('cv', cvFile)

    try {
      const res = await fetch('http://127.0.0.1:8000/candidates/apply', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      setScore(data.match_score)
      setSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', backgroundColor: '#020608', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: '40px', height: '40px', border: '2px solid rgba(59,130,246,0.2)', borderTop: '2px solid #3b82f6', borderRadius: '50%' }}
      />
    </main>
  )

  if (success) return (
    <main style={{ minHeight: '100vh', backgroundColor: '#020608', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '4rem',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          maxWidth: '500px'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          style={{
            width: '80px', height: '80px',
            backgroundColor: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 2rem'
          }}
        >✓</motion.div>

        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '1rem', letterSpacing: '-1px' }}>
          Candidature envoyée !
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', lineHeight: '1.7' }}>
          Votre CV a été analysé par notre IA
        </p>

        {score !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              backgroundColor: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Match Score</p>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              letterSpacing: '-2px',
              background: score >= 70
                ? 'linear-gradient(135deg, #34d399, #10b981)'
                : score >= 40
                ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                : 'linear-gradient(135deg, #f87171, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>{score.toFixed(1)}%</div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              {score >= 70 ? '🎯 Excellent profil !' : score >= 40 ? '👍 Bon profil' : '📝 Profil partiel'}
            </p>
          </motion.div>
        )}

        <Link href="/jobs">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >Voir d'autres offres</motion.button>
        </Link>
      </motion.div>
    </main>
  )

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#020608',
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: 'white'
    }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          top: '10%', right: '20%',
          width: '500px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}/>
      </div>

      {/* Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.2rem 3rem',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        backgroundColor: 'rgba(2,6,8,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 8px #3b82f6' }}/>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '2px', color: 'white' }}>SUPERRH</span>
          </div>
        </Link>
        <Link href="/jobs" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
          ← Retour aux offres
        </Link>
      </nav>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '8rem 2rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

          {/* Left — Job Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p style={{ color: '#3b82f6', fontSize: '0.75rem', letterSpacing: '4px', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '600' }}>Postuler</p>
            <h1 style={{ fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '1rem', lineHeight: '1.1' }}>
              {job?.titre}
            </h1>

            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
              color: '#34d399',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '500',
              marginBottom: '2rem'
            }}>● Active</span>

            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '2rem' }}>
              {job?.description}
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>Compétences requises</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {job?.competences.split(',').map(skill => (
                  <span key={skill} style={{
                    backgroundColor: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    color: '#93c5fd',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}>{skill.trim()}</span>
                ))}
              </div>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Type', value: 'CDI' },
                { label: 'Lieu', value: 'Maroc' },
                { label: 'Niveau', value: 'Junior / Senior' },
                { label: 'Secteur', value: 'Tech' },
              ].map(item => (
                <div key={item.label} style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '1rem'
                }}>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '2.5rem',
              position: 'sticky',
              top: '6rem'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              Votre candidature
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Remplissez le formulaire et uploadez votre CV
            </p>

            {/* Inputs */}
            {[
              { key: 'nom', label: 'Nom complet', placeholder: 'Ahmed Benali', type: 'text' },
              { key: 'email', label: 'Email', placeholder: 'ahmed@gmail.com', type: 'email' },
              { key: 'telephone', label: 'Téléphone', placeholder: '0600000000', type: 'tel' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            ))}

            {/* Drag & Drop CV */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                CV (PDF)
              </label>
              <motion.div
                animate={{ borderColor: dragOver ? 'rgba(59,130,246,0.6)' : cvFile ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)' }}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault()
                  setDragOver(false)
                  const file = e.dataTransfer.files[0]
                  if (file?.type === 'application/pdf') setCvFile(file)
                }}
                onClick={() => document.getElementById('cv-input')?.click()}
                style={{
                  border: '2px dashed rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: dragOver ? 'rgba(59,130,246,0.05)' : cvFile ? 'rgba(16,185,129,0.05)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                {cvFile ? (
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
                    <p style={{ color: '#34d399', fontSize: '0.875rem', fontWeight: '500' }}>{cvFile.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '4px' }}>Cliquez pour changer</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📄</div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Glissez votre CV ici</p>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', marginTop: '4px' }}>ou cliquez pour parcourir</p>
                  </div>
                )}
                <input
                  id="cv-input"
                  type="file"
                  accept=".pdf"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) setCvFile(file)
                  }}
                />
              </motion.div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={submitting || !form.nom || !form.email || !form.telephone || !cvFile}
              style={{
                width: '100%',
                background: submitting || !form.nom || !form.email || !form.telephone || !cvFile
                  ? 'rgba(255,255,255,0.08)'
                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: submitting || !form.nom || !form.email || !form.telephone || !cvFile
                  ? 'rgba(255,255,255,0.3)'
                  : 'white',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '600',
                border: 'none',
                cursor: submitting || !form.nom || !form.email || !form.telephone || !cvFile ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 0 15px rgba(59,130,246,0.2)'
              }}
            >
              {submitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }}
                  />
                  Analyse en cours...
                </span>
              ) : 'Envoyer ma candidature →'}
            </motion.button>

            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem' }}>
              🔒 Vos données sont sécurisées et confidentielles
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}