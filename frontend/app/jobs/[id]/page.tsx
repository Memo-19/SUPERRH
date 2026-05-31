'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  User, Mail, Phone, UploadCloud, CheckCircle, ArrowLeft, FileText, Lock, Loader2
} from 'lucide-react'

interface Job {
  id: number
  titre: string
  description: string
  competences: string
  statut: string
}

export default function JobDetailsAndApplyPage() {
  const params = useParams()
  
  // ─── STATES ───
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [form, setForm] = useState({ nom: '', email: '', telephone: '' })
  const [focused, setFocused] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── FETCH JOB DATA ───
  useEffect(() => {
    fetch('http://127.0.0.1:8000/jobs/')
      .then(res => res.json())
      .then(data => {
        const found = data.find((j: Job) => j.id === Number(params.id))
        setJob(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  // ─── DRAG & DROP LOGIC ───
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === 'application/pdf') setCvFile(droppedFile)
      else alert("Veuillez importer un fichier PDF uniquement.")
    }
  }

  // ─── SUBMIT LOGIC ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nom || !form.email || !form.telephone || !cvFile) return
    
    setSubmitting(true)
    const formData = new FormData()
    formData.append('nom', form.nom)
    formData.append('email', form.email)
    formData.append('telephone', form.telephone)
    formData.append('job_id', String(params.id))
    formData.append('cv', cvFile)
    
    try {
      await fetch('http://127.0.0.1:8000/candidates/apply', {
        method: 'POST',
        body: formData
      })
      setSuccess(true)
    } catch (err) {
      console.error(err)
      alert("Une erreur s'est produite lors de l'envoi.")
    } finally {
      setSubmitting(false)
    }
  }

  // ─── STYLES ───
  const IS = (name: string): React.CSSProperties => ({
    width: '100%',
    padding: '14px 14px 14px 44px',
    border: `1px solid ${focused === name ? '#06b6d4' : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 14,
    fontSize: '0.95rem', color: 'white',
    background: focused === name ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
    outline: 'none',
    transition: 'all 0.3s',
    boxShadow: focused === name ? '0 0 0 3px rgba(6,182,212,0.2)' : 'inset 0 2px 4px rgba(0,0,0,0.2)',
    fontFamily: 'inherit',
  })

  if (loading) return (
    <main style={{ minHeight: '100vh', backgroundColor: '#030303', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Loader2 size={40} color="#06b6d4" />
      </motion.div>
    </main>
  )

  if (!job && !loading) return (
    <main style={{ minHeight: '100vh', backgroundColor: '#030303', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Offre introuvable</h1>
      <Link href="/jobs" style={{ color: '#06b6d4', textDecoration: 'none' }}>← Retour aux offres</Link>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#030303', color: 'white', fontFamily: "'Inter', sans-serif", position: 'relative', overflowX: 'hidden' }}>
      
      {/* 🌌 AURORA BACKGROUND */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }}
          style={{ position: 'absolute', top: '10%', left: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 60%)', filter: 'blur(100px)' }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 40%, transparent 100%)' }}/>
      </div>

      {/* 🧊 NAVBAR */}
      <nav style={{ position: 'relative', zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(3,3,3,0.6)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: 'white', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: 'white' }}>
              Super<span style={{ color: '#06b6d4' }}>RH</span>
            </span>
          </Link>
          <Link href="/jobs" style={{ textDecoration: 'none' }}>
            <motion.button whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', padding: '10px 18px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', backdropFilter: 'blur(10px)' }}
            >
              <ArrowLeft size={16} /> Retour aux offres
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* 🖥️ MAIN CONTENT */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '4rem auto', padding: '0 2rem' }}>
        
        {/* CSS Grid for Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          
          {/* ─── LEFT COLUMN: JOB DETAILS ─── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#22d3ee', padding: '6px 16px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(6,182,212,0.2)' }}>
              Offre d'emploi {job?.statut === 'Active' ? '• En cours' : ''}
            </div>
            
            <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '2.5rem', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {job?.titre}
            </h1>

            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              <h3 style={{ color: 'white', fontWeight: 800, marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 24, borderRadius: 4, background: '#06b6d4' }}/> Description du poste
              </h3>
              <p style={{ marginBottom: '2.5rem' }}>
                {job?.description}
              </p>
              
              {job?.competences && (
                <>
                  <h3 style={{ color: 'white', fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 24, borderRadius: 4, background: '#8b5cf6' }}/> Compétences requises
                  </h3>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {job.competences.split(',').map((skill, i) => (
                      <span key={i} style={{ backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#c4b5fd', padding: '8px 16px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600 }}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* ─── RIGHT COLUMN: THE APPLICATION FORM ─── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(40px)', 
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: '30px', 
              padding: '3rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)' 
            }}>
              
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
                      <CheckCircle size={45} />
                    </motion.div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>Candidature Envoyée !</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '2.5rem', fontSize: '1.05rem' }}>
                      Votre CV a été reçu. Il sera analysé par notre système intelligent et notre équipe RH vous contactera très prochainement.
                    </p>
                    <Link href="/jobs" style={{ textDecoration: 'none' }}>
                      <motion.button whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.95 }}
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '14px 28px', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Voir d'autres offres
                      </motion.button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ padding: 8, background: 'rgba(6,182,212,0.15)', borderRadius: 12, border: '1px solid rgba(6,182,212,0.3)' }}>
                        <UploadCloud size={24} color="#06b6d4" />
                      </div>
                      Postuler à cette offre
                    </h2>
                    
                    {/* Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                      <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: focused === 'nom' ? '#06b6d4' : 'rgba(255,255,255,0.4)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                        <input type="text" placeholder="Nom et Prénom *" required value={form.nom} 
                          onChange={e => setForm({...form, nom: e.target.value})} 
                          onFocus={() => setFocused('nom')} onBlur={() => setFocused('')} style={IS('nom')} 
                        />
                      </div>
                      
                      <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: focused === 'email' ? '#06b6d4' : 'rgba(255,255,255,0.4)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                        <input type="email" placeholder="Adresse Email *" required value={form.email} 
                          onChange={e => setForm({...form, email: e.target.value})} 
                          onFocus={() => setFocused('email')} onBlur={() => setFocused('')} style={IS('email')} 
                        />
                      </div>

                      <div style={{ position: 'relative' }}>
                        <Phone size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: focused === 'tel' ? '#06b6d4' : 'rgba(255,255,255,0.4)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                        <input type="tel" placeholder="Numéro de téléphone *" required value={form.telephone} 
                          onChange={e => setForm({...form, telephone: e.target.value})} 
                          onFocus={() => setFocused('tel')} onBlur={() => setFocused('')} style={IS('tel')} 
                        />
                      </div>
                    </div>

                    {/* Drag & Drop CV Area */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Curriculum Vitae (CV) *</label>
                      
                      <input type="file" ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) setCvFile(file); }} accept=".pdf" style={{ display: 'none' }} />
                      
                      <motion.div 
                        whileHover={{ backgroundColor: cvFile ? 'rgba(16,185,129,0.1)' : 'rgba(6,182,212,0.1)' }}
                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: `2px dashed ${dragOver ? '#06b6d4' : cvFile ? '#10b981' : 'rgba(6,182,212,0.4)'}`,
                          backgroundColor: dragOver ? 'rgba(6,182,212,0.15)' : cvFile ? 'rgba(16,185,129,0.08)' : 'rgba(6,182,212,0.04)',
                          borderRadius: '20px', padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer',
                          transition: 'all 0.3s ease', boxShadow: dragOver ? '0 0 30px rgba(6,182,212,0.2)' : cvFile ? '0 0 30px rgba(16,185,129,0.2)' : '0 10px 30px rgba(0,0,0,0.1)'
                        }}
                      >
                        {cvFile ? (
                          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
                              <FileText size={28} />
                            </div>
                            <span style={{ fontWeight: 800, color: '#34d399', fontSize: '1.1rem' }}>{cvFile.name}</span>
                            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Cliquez pour modifier</span>
                          </motion.div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, pointerEvents: 'none' }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: dragOver ? '#06b6d4' : 'rgba(6,182,212,0.15)', color: dragOver ? 'white' : '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                              <UploadCloud size={28} />
                            </div>
                            <div>
                              <p style={{ fontWeight: 800, fontSize: '1.1rem', color: dragOver ? 'white' : '#22d3ee', marginBottom: 4 }}>Glissez votre CV ici</p>
                              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>ou cliquez pour parcourir (PDF)</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Submit Button */}
                    <motion.button 
                      whileHover={cvFile && form.nom && form.email && form.telephone ? { scale: 1.03, boxShadow: '0 10px 40px rgba(6,182,212,0.5)' } : {}}
                      whileTap={cvFile && form.nom && form.email && form.telephone ? { scale: 0.97 } : {}}
                      type="submit"
                      disabled={submitting || !cvFile || !form.nom || !form.email || !form.telephone}
                      style={{
                        width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                        background: (cvFile && form.nom && form.email && form.telephone) ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                        color: (cvFile && form.nom && form.email && form.telephone) ? 'white' : 'rgba(255,255,255,0.3)',
                        fontSize: '1.1rem', fontWeight: 800, cursor: (cvFile && form.nom && form.email && form.telephone) ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.3s', fontFamily: 'inherit'
                      }}
                    >
                      {submitting ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 22, height: 22, border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%' }} />
                      ) : (
                        <>Envoyer ma candidature</>
                      )}
                    </motion.button>
                    
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textAlign: 'center', marginTop: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Lock size={12}/> Données sécurisées et traitées par IA
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}