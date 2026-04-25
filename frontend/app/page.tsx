'use client'

import { motion } from 'framer-motion' //bibliothèque d'animation pour React
import Link from 'next/link' //composant de Next.js pour la navigation entre les pages de facon vite
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#020608',
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: 'white',
      overflowX: 'hidden'
    }}>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 3rem',
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          backgroundColor: 'rgba(2,6,8,0.6)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.div
            animate={{ boxShadow: ['0 0 6px #3b82f6', '0 0 14px #3b82f6', '0 0 6px #3b82f6'] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}
          />
          <span style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '2px' }}>SUPERRH</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {[
            { label: 'Features', href: '#features' },
            { label: 'Process', href: '#process' },
            { label: 'Stats', href: '#stats' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{
              color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}>{item.label}</a>
          ))}
          <Link href="/jobs">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59,130,246,0.5)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                padding: '8px 22px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >Voir les offres →</motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/buildings.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) saturate(0.8)',
          zIndex: 0
        }}/>

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(2,6,8,0.4) 0%, rgba(2,6,8,0.1) 40%, rgba(2,6,8,0.7) 80%, rgba(2,6,8,1) 100%)',
          zIndex: 1
        }}/>

        {/* Blue glow */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}/>

        {/* Stars */}
        {mounted && Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              width: '1px', height: '1px',
              backgroundColor: 'white',
              borderRadius: '50%',
              zIndex: 2
            }}
          />
        ))}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ position: 'relative', zIndex: 3, padding: '0 2rem', maxWidth: '800px' }}
        >
          <h1 style={{
            fontSize: '5.5rem',
            fontWeight: '800',
            lineHeight: '1.05',
            letterSpacing: '-3px',
            marginBottom: '1.5rem'
          }}>
            <span style={{ color: 'white' }}>Recrutez les</span><br/>
            <span style={{
              background: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 50%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>meilleurs talents</span><br/>
            <span style={{
              fontSize: '2.5rem',
              fontWeight: '300',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '-1px'
            }}>en quelques clics</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '1.05rem',
            maxWidth: '500px',
            margin: '0 auto 3rem',
            lineHeight: '1.8'
          }}>
            SUPERRH analyse automatiquement les CVs, calcule
            le score de compatibilité et classe vos candidats
            pour vous faire gagner du temps.
          </p>

          <Link href="/jobs">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59,130,246,0.6)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(59,130,246,0.3)'
              }}
            >Voir les offres d'emploi →</motion.button>
          </Link>
        </motion.div>

        {/* Scroll */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            color: 'rgba(255,255,255,0.2)',
            fontSize: '0.65rem',
            letterSpacing: '3px'
          }}
        >
          <div style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, #3b82f6, transparent)' }}/>
          SCROLL
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" style={{
        display: 'flex',
        justifyContent: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.02)'
      }}>
        {[
          { value: '12,400+', label: 'CVs analysés' },
          { value: '95%', label: 'Précision IA' },
          { value: '99.97%', label: 'Uptime' },
          { value: '4.9/5', label: 'Satisfaction' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ backgroundColor: 'rgba(59,130,246,0.05)' }}
            style={{
              flex: 1,
              padding: '2.5rem 2rem',
              textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              transition: 'background-color 0.2s'
            }}
          >
            <div style={{
              fontSize: '2.2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #fff, #93c5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}>{stat.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', marginTop: '4px' }}>{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '8rem 4rem', backgroundColor: '#020608' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{ color: '#3b82f6', fontSize: '0.75rem', letterSpacing: '4px', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '600' }}>Features</p>
          <h2 style={{ fontSize: '2.8rem', fontWeight: '700', letterSpacing: '-1.5px' }}>Tout ce dont vous avez besoin</h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          overflow: 'hidden',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {[
            { icon: '⚡', title: 'Analyse instantanée', desc: 'pdfplumber extrait le texte de chaque CV en moins de 3 secondes.' },
            { icon: '🎯', title: 'Match Score IA', desc: 'TF-IDF + Cosine Similarity pour une compatibilité précise.' },
            { icon: '📊', title: 'Classement auto', desc: 'Candidats triés automatiquement du meilleur au moins compatible.' },
            { icon: '🔒', title: 'Accès sécurisé', desc: 'JWT Authentication pour protéger le dashboard RH.' },
            { icon: '📧', title: 'Notifications', desc: 'Emails automatiques envoyés aux candidats après chaque décision.' },
            { icon: '📈', title: 'Analytics', desc: 'Statistiques complètes sur vos campagnes de recrutement.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ backgroundColor: 'rgba(59,130,246,0.06)' }}
              style={{
                backgroundColor: '#020608',
                padding: '2.5rem 2rem',
                transition: 'all 0.25s'
              }}
            >
              <div style={{
                width: '40px', height: '40px',
                backgroundColor: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                marginBottom: '1.2rem'
              }}>{f.icon}</div>
              <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '0.6rem' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', lineHeight: '1.7' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" style={{
        padding: '6rem 4rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: '#020608'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <p style={{ color: '#3b82f6', fontSize: '0.75rem', letterSpacing: '4px', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '600' }}>Process</p>
          <h2 style={{ fontSize: '2.8rem', fontWeight: '700', letterSpacing: '-1.5px' }}>3 étapes simples</h2>
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { step: '01', title: 'Candidat postule', desc: 'Il choisit un poste et uploade son CV en PDF sur la plateforme.' },
            { step: '02', title: 'IA analyse', desc: 'SUPERRH extrait les compétences et calcule le Match Score automatiquement.' },
            { step: '03', title: 'RH décide', desc: 'Les candidats classés apparaissent dans le dashboard pour une décision rapide.' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '2rem',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none'
              }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px', height: '48px',
                backgroundColor: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '50%',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#3b82f6',
                marginBottom: '1.5rem'
              }}>{s.step}</div>
              <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' }}>{s.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', lineHeight: '1.7' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        position: 'relative',
        padding: '10rem 2rem',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/buildings.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
          filter: 'brightness(0.2) saturate(0.6)',
          zIndex: 0
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, #020608 0%, rgba(2,6,8,0.5) 30%, rgba(2,6,8,0.5) 70%, #020608 100%)',
          zIndex: 1
        }}/>
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          zIndex: 2,
          filter: 'blur(40px)'
        }}/>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', zIndex: 3 }}
        >
          <h2 style={{
            fontSize: '4rem',
            fontWeight: '800',
            letterSpacing: '-2px',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 60%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Prêt à recruter<br/>intelligemment ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1rem', marginBottom: '2.5rem' }}>
            Commencez maintenant — gratuit et sans inscription.
          </p>
          <Link href="/jobs">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59,130,246,0.6)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(59,130,246,0.3)'
              }}
            >Commencer maintenant →</motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 3rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.2)',
        fontSize: '0.8rem',
        backgroundColor: '#020608'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%' }}/>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>SUPERRH</span>
        </div>
        <span>© 2026 — Tous droits réservés</span>
      </footer>

    </main>
  )
}