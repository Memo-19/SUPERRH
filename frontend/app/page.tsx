'use client'

import { motion, useScroll, useTransform, Variants } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Brain, FileSearch, LayoutDashboard,
  CheckCircle, Zap, Users, Star,
  ChevronRight, Activity, Sparkles,
  BarChart3, Clock, Target, Briefcase
} from 'lucide-react'

// ─── FLOATING BADGE ───────────────────────────────────
function FloatingBadge({ children, style, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: '10px 16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          ...style,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// ─── COUNTER ──────────────────────────────────────────
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        let start = 0
        const duration = 2000
        const step = (end / duration) * 16
        const timer = setInterval(() => {
          start += step
          if (start >= end) { setCount(end); clearInterval(timer) }
          else setCount(Math.floor(start))
        }, 16)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, started])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [navScrolled, setNavScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // إعداد الأنيميشن بشكل سليم للـ TypeScript
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number = 0) => ({
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }
    })
  }

  const navLinks = [
    { name: 'Notre Solution', id: 'fonctionnalites' },
    { name: 'Impact', id: 'statistiques' },
    { name: 'Contact', id: 'apropos' }
  ]

  const stats = [
    { icon: CheckCircle, value: 10, suffix: 'k+', label: 'CVs Traités', color: '#06b6d4' },
    { icon: Target, value: 99, suffix: '%', label: 'Précision de Matching', color: '#8b5cf6' },
    { icon: Clock, value: 80, suffix: '%', label: 'Temps Économisé (RH)', color: '#10b981' },
    { icon: Users, value: 500, suffix: '+', label: 'Recrutements Réussis', color: '#f59e0b' },
  ]

  return (
    <main style={{ backgroundColor: '#030303', color: 'white', fontFamily: "'Inter', -apple-system, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.3); border-radius: 4px; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ══════════════════════════════════════
          FLOATING NAVBAR (THE PILL)
      ══════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 20, left: 0, right: 0, zIndex: 100,
          display: 'flex', justifyContent: 'center', pointerEvents: 'none'
        }}
      >
        <div style={{
          pointerEvents: 'auto',
          background: navScrolled ? 'rgba(3,3,3,0.85)' : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 50,
          padding: '8px 12px 8px 24px',
          display: 'flex', alignItems: 'center', gap: 32,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease'
        }}>
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: 'white', boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.5, color: 'white', fontFamily: 'inherit' }}>
              Super<span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>RH</span>
            </span>
          </button>

          {/* Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {navLinks.map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 14px', borderRadius: 20, transition: 'all 0.2s', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' }}
              >{item.name}</button>
            ))}
          </nav>

          {/* Connect Button */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', marginRight: 16 }}/>
            <Link href="/admin/login" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.12)' }} whileTap={{ scale: 0.97 }}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '10px 20px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', transition: 'all 0.2s' }}
              >
                Connexion <ArrowRight size={14}/>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ══════════════════════════════════════
          HERO (CLEAR PATHS FOR HR vs CANDIDATE)
      ══════════════════════════════════════ */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '10rem', paddingBottom: '4rem' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity }}
            style={{ position: 'absolute', top: '10%', left: '10%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 14, repeat: Infinity, delay: 2 }}
            style={{ position: 'absolute', bottom: '10%', right: '5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(100px)' }}
          />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)' }}/>
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 2rem', maxWidth: 900, margin: '0 auto' }}>
          
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 30, padding: '6px 16px', marginBottom: '2.5rem' }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}><Sparkles size={14} color="#06b6d4"/></motion.div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#22d3ee', letterSpacing: 0.5 }}>L'Intelligence Artificielle au service des RH</span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, marginBottom: '2rem' }}
          >
            <span style={{ color: 'white' }}>Recrutez les Meilleurs, </span>
            <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6, #06b6d4)', backgroundSize: '200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradientShift 4s ease infinite' }}>
              Plus Rapidement.
            </span>
          </motion.h1>
          <style>{`@keyframes gradientShift { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }`}</style>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 680, margin: '0 auto 3rem' }}
          >
            Fini le tri manuel interminable. Notre plateforme analyse, filtre et classe les candidatures pour vous permettre de vous concentrer sur l'essentiel : l'humain.
          </motion.p>

          {/* TWO CLEAR PATHS: HR & CANDIDATE */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}
          >
            <Link href="/admin/login" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(6,182,212,0.4), 0 0 100px rgba(139,92,246,0.2)' }}
                whileTap={{ scale: 0.97 }}
                style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', border: 'none', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', padding: '16px 32px', borderRadius: 40, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', boxShadow: '0 0 30px rgba(6,182,212,0.3)' }}
              >
                <LayoutDashboard size={18}/> Espace Recruteur
              </motion.button>
            </Link>

            <Link href="/jobs" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.97 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', padding: '16px 32px', borderRadius: 40, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
              >
                <Briefcase size={18}/> Espace Candidat
              </motion.button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}
          >
            {['Analyse de CV Instantanée', 'Évaluation Objective', 'Gain de Temps'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} color="#06b6d4"/>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating UI elements */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
          <div style={{ position: 'absolute', top: '25%', right: '8%' }}>
            <FloatingBadge delay={0.8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={16} color="white"/>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Candidat Idéal</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#06b6d4', letterSpacing: -0.5 }}>98%</div>
                </div>
              </div>
            </FloatingBadge>
          </div>

          <div style={{ position: 'absolute', top: '42%', left: '5%' }}>
            <FloatingBadge delay={1.1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}/>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>CV Décrypté</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Compétences Extraites</div>
                </div>
              </div>
            </FloatingBadge>
          </div>

          <div style={{ position: 'absolute', bottom: '20%', right: '12%' }}>
            <FloatingBadge delay={1.4}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={15} color="#8b5cf6"/>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Productivité RH</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>x3 <span style={{ color: '#34d399', fontSize: 11 }}>Accélérée</span></div>
                </div>
              </div>
            </FloatingBadge>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BANNER
      ══════════════════════════════════════ */}
      <section id="statistiques" style={{ padding: '0 2rem', position: 'relative', zIndex: 10, scrollMarginTop: '120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            padding: '2.5rem 3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: '1rem',
          }}
        >
          {stats.map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 1rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `${stat.color}15`, border: `1px solid ${stat.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <stat.icon size={20} color={stat.color}/>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: stat.color, letterSpacing: -1, lineHeight: 1 }}>
                  <Counter end={stat.value} suffix={stat.suffix}/>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3, fontWeight: 500 }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES BENTO
      ══════════════════════════════════════ */}
      <section id="fonctionnalites" style={{ padding: '8rem 2rem', position: 'relative', zIndex: 10, scrollMarginTop: '120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 30, padding: '5px 14px', marginBottom: '1.5rem' }}>
            <Zap size={13} color="#a78bfa"/>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', letterSpacing: 1, textTransform: 'uppercase' }}>Notre Solution</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: -1, marginBottom: '1rem' }}>
            <span style={{ color: 'white' }}>Laissez l'IA faire le tri,</span>
            <br/>
            <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Prenez les bonnes décisions.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 580, margin: '0 auto' }}>
            Notre ATS (Applicant Tracking System) transforme des milliers de données en recommandations claires, vous aidant à identifier les profils parfaits instantanément.
          </p>
        </motion.div>

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 16 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setHoveredFeature(0)}
            onMouseLeave={() => setHoveredFeature(null)}
            style={{
              gridColumn: '1 / -1',
              background: hoveredFeature === 0 ? 'rgba(6,182,212,0.06)' : 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${hoveredFeature === 0 ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 24,
              padding: '2.5rem',
              cursor: 'default',
              transition: 'all 0.3s ease',
              boxShadow: hoveredFeature === 0 ? '0 0 60px rgba(6,182,212,0.08)' : 'none',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={26} color="#06b6d4"/>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: 2 }}>Moteur Intelligent</span>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: -0.5, marginBottom: '1rem' }}>Matching de Profils</h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                Le système analyse instantanément les compétences d'un candidat et les compare aux exigences du poste pour vous fournir un score de compatibilité précis et objectif.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem', flexWrap: 'wrap' }}>
                {['Scoring Automatique', 'Évaluation Neutre', 'Gain de Temps'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', color: '#22d3ee', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 18, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: 2 }}>Classement en Temps Réel</div>
              {[
                { name: 'Ahmed B.', score: 94, color: '#10b981' },
                { name: 'Sara M.', score: 87, color: '#06b6d4' },
                { name: 'Khalid R.', score: 72, color: '#f59e0b' },
                { name: 'Nadia L.', score: 58, color: '#f87171' },
              ].map((c, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${c.color}20`, border: `1px solid ${c.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: c.color, flexShrink: 0 }}>{c.name.charAt(0)}</div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', flex: 1 }}>{c.name}</span>
                  <div style={{ width: 100, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${c.score}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      style={{ height: '100%', background: c.color, borderRadius: 4 }}
                    />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: c.color, minWidth: 36, textAlign: 'right', fontFamily: 'monospace' }}>{c.score}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onMouseEnter={() => setHoveredFeature(1)}
            onMouseLeave={() => setHoveredFeature(null)}
            style={{
              background: hoveredFeature === 1 ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${hoveredFeature === 1 ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 24,
              padding: '2.25rem',
              cursor: 'default',
              transition: 'all 0.3s ease',
              boxShadow: hoveredFeature === 1 ? '0 0 60px rgba(139,92,246,0.08)' : 'none',
            }}
          >
            <div style={{ width: 50, height: 50, borderRadius: 15, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <FileSearch size={24} color="#8b5cf6"/>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: -0.4, marginBottom: '0.9rem' }}>Lecture Avancée des CVs</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              Plus besoin de lire chaque ligne. SuperRH lit et extrait intelligemment les données clés des CVs, quel que soit leur format (PDF, Word, ou Image).
            </p>
            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 14, padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: 11 }}>
              <div style={{ color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>// Compétences détectées</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Python', 'React', 'Management', 'FastAPI', 'Leadership'].map(skill => (
                  <span key={skill} style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', padding: '3px 9px', borderRadius: 6, fontSize: 11 }}>{skill}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onMouseEnter={() => setHoveredFeature(2)}
            onMouseLeave={() => setHoveredFeature(null)}
            style={{
              background: hoveredFeature === 2 ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${hoveredFeature === 2 ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 24,
              padding: '2.25rem',
              cursor: 'default',
              transition: 'all 0.3s ease',
              boxShadow: hoveredFeature === 2 ? '0 0 60px rgba(16,185,129,0.08)' : 'none',
            }}
          >
            <div style={{ width: 50, height: 50, borderRadius: 15, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <LayoutDashboard size={24} color="#10b981"/>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: -0.4, marginBottom: '0.9rem' }}>Suivi Centralisé</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              Un tableau de bord complet pour gérer vos offres d'emploi, suivre l'évolution des candidatures et prendre des décisions basées sur des données fiables.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 14, padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-end', gap: 6, height: 70 }}>
              {[40, 65, 45, 80, 55, 90, 70, 95, 78, 88].map((h, i) => (
                <motion.div key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                  style={{ flex: 1, background: `rgba(16,185,129,${0.3 + (i / 10) * 0.5})`, borderRadius: '3px 3px 0 0', minWidth: 6 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      <section style={{ padding: '6rem 2rem', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            maxWidth: 800,
            margin: '0 auto',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 32,
            padding: '4rem 3rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 30, padding: '5px 14px', marginBottom: '1.5rem' }}>
              <Star size={13} color="#34d399"/>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399', letterSpacing: 1 }}>SOLUTION COMPLÈTE</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: -1, marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Simplifiez vos embauches</span>
              <br/>
              <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>dès aujourd'hui.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              Rejoignez les entreprises qui utilisent SuperRH pour repérer les meilleurs profils et accélérer leur croissance.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/admin/login" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(6,182,212,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', border: 'none', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: '14px 28px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 0 30px rgba(6,182,212,0.2)' }}
                >Espace Recruteur <LayoutDashboard size={16}/></motion.button>
              </Link>
              <Link href="/jobs" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', padding: '14px 26px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', transition: 'all 0.2s' }}
                >Voir les offres <Briefcase size={15}/></motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer id="apropos" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem 2rem', position: 'relative', zIndex: 10, scrollMarginTop: '100px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: 'white' }}>S</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>
              SuperRH — <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>Plateforme ATS Intelligente</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {['Faculté des Sciences Tétouan', 'Projet de Fin d\'Études', '2026'].map(tech => (
              <span key={tech} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{tech}</span>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}