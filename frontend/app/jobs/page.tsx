'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Briefcase, ArrowRight, MapPin, Clock, Search, Sparkles, Loader2 } from 'lucide-react'

interface Job {
  id: number
  titre: string
  description: string
  competences: string
  statut: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/jobs/')
      .then(res => res.json())
      .then(data => { setJobs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // فلترة الوظائف بناءً على البحث
  const filteredJobs = jobs.filter(job => 
    job.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.competences.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#030303', // لون SuperRH المظلم
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: 'white',
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* 🌌 AURORA BACKGROUND */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }}
          style={{ position: 'absolute', top: '5%', left: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 60%)', filter: 'blur(100px)' }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 100% 100% at 50% 10%, black 40%, transparent 100%)' }}/>
      </div>

      {/* 🧊 NAVBAR */}
      <nav style={{ position: 'relative', zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(3,3,3,0.5)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: 'white', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: 'white' }}>
              Super<span style={{ color: '#06b6d4' }}>RH</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}/>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600 }}>
              {jobs.length} offre{jobs.length > 1 ? 's' : ''} disponible{jobs.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </nav>

      {/* 🖥️ CONTENT */}
      <div style={{ position: 'relative', zIndex: 1, padding: '6rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* ─── HEADER & SEARCH ─── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#22d3ee', padding: '6px 16px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            <Sparkles size={14} /> Espace Candidat
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Trouvez votre <br/>
            <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>prochain poste.</span>
          </h1>
          
          {/* Search Bar */}
          <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            <input 
              type="text" 
              placeholder="Rechercher par titre ou compétence..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '18px 20px 18px 55px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px', color: 'white', fontSize: '1rem', outline: 'none',
                backdropFilter: 'blur(20px)', transition: 'all 0.3s',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#06b6d4'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)' }}
            />
          </div>
        </motion.div>

        {/* ─── LOADING STATE ─── */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Loader2 size={40} color="#06b6d4" />
            </motion.div>
          </div>
        )}

        {/* ─── JOBS GRID (Bento Style) ─── */}
        {!loading && (
          <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {filteredJobs.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px dashed rgba(255,255,255,0.1)' }}>
                  Aucune offre ne correspond à votre recherche.
                </motion.div>
              ) : (
                filteredJobs.map((job, i) => (
                  <motion.div
                    layout
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(6,182,212,0.3)' }}
                    style={{
                      background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px',
                      padding: '2rem', display: 'flex', flexDirection: 'column',
                      transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Status & Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div style={{ width: 44, height: 44, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Briefcase size={20} color="#06b6d4" />
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }}/> Active
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '0.8rem', lineHeight: 1.2 }}>
                      {job.titre}
                    </h2>
                    
                    {/* Meta tags (Mocked for visual appeal as standard ATS) */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14}/> Tétouan</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14}/> Temps Plein</span>
                    </div>

                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.description}
                    </p>

                    {/* Skills Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                      {job.competences.split(',').slice(0, 4).map((skill, idx) => ( // عرض أول 4 مهارات فقط
                        <span key={idx} style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#c4b5fd', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 500 }}>
                          {skill.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Link href={`/jobs/${job.id}`} style={{ marginTop: 'auto', textDecoration: 'none' }}>
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: '100%', background: 'rgba(6,182,212,0.1)', color: '#22d3ee',
                          padding: '14px', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 700,
                          border: '1px solid rgba(6,182,212,0.2)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          transition: 'all 0.3s', fontFamily: 'inherit'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #06b6d4, #8b5cf6)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.border = 'none' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.1)'; e.currentTarget.style.color = '#22d3ee'; e.currentTarget.style.border = '1px solid rgba(6,182,212,0.2)' }}
                      >
                        Postuler <ArrowRight size={16} />
                      </motion.button>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  )
}