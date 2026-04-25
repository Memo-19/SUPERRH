'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'

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

  useEffect(() => {
    fetch('http://127.0.0.1:8000/jobs/')
      .then(res => res.json())
      .then(data => { setJobs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

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
          top: '10%', left: '20%',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)'
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
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
          {jobs.length} offre{jobs.length > 1 ? 's' : ''} disponible{jobs.length > 1 ? 's' : ''}
        </div>
      </nav>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '8rem 4rem 4rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{ color: '#3b82f6', fontSize: '0.75rem', letterSpacing: '4px', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '600' }}>Offres d'emploi</p>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-2px', marginBottom: '1rem' }}>
            Trouvez votre<br/>
            <span style={{
              background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>prochain poste</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            Postulez en quelques clics et laissez notre IA analyser votre profil
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '40px', height: '40px',
                border: '2px solid rgba(59,130,246,0.2)',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                margin: '0 auto'
              }}
            />
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            overflow: 'hidden',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {jobs.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                Aucune offre disponible pour le moment
              </div>
            ) : (
              jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ backgroundColor: 'rgba(59,130,246,0.06)' }}
                  style={{
                    backgroundColor: '#020608',
                    padding: '2.5rem',
                    transition: 'all 0.25s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {/* Job Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      width: '44px', height: '44px',
                      backgroundColor: 'rgba(59,130,246,0.1)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}>💼</div>
                    <span style={{
                      backgroundColor: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      color: '#34d399',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>● Active</span>
                  </div>

                  {/* Title */}
                  <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white', letterSpacing: '-0.5px' }}>
                    {job.titre}
                  </h2>

                  {/* Description */}
                  <p style={{
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: '0.875rem',
                    lineHeight: '1.7',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {job.description}
                  </p>

                  {/* Skills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {job.competences.split(',').map(skill => (
                      <span key={skill} style={{
                        backgroundColor: 'rgba(59,130,246,0.08)',
                        border: '1px solid rgba(59,130,246,0.15)',
                        color: '#93c5fd',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem'
                      }}>{skill.trim()}</span>
                    ))}
                  </div>

                  {/* Apply Button */}
                  <Link href={`/jobs/${job.id}`} style={{ marginTop: 'auto' }}>
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 0 15px rgba(59,130,246,0.2)'
                      }}
                    >Postuler maintenant →</motion.button>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}