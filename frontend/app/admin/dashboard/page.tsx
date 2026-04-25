'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Candidate {
  id: number
  nom: string
  email: string
  telephone: string
  job_id: number
  match_score: number
  statut: string
}

interface Job {
  id: number
  titre: string
  description: string
  competences: string
  statut: string
}

function AddJobForm({ onAdd }: { onAdd: (job: any) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ titre: '', description: '', competences: '' })
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!form.titre || !form.description || !form.competences) return
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/jobs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      onAdd({ ...form, id: data.job_id, statut: 'active' })
      setForm({ titre: '', description: '', competences: '' })
      setOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          color: 'white', padding: '10px 20px',
          borderRadius: '10px', border: 'none',
          fontSize: '0.875rem', fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 0 15px rgba(99,102,241,0.3)'
        }}
      >+ Ajouter une offre</motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: '#111118',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '16px', padding: '1.5rem',
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}
        >
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Titre du poste
            </label>
            <input
              placeholder="Développeur Full-Stack"
              value={form.titre}
              onChange={e => setForm({ ...form, titre: e.target.value })}
              style={{
                width: '100%', backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '10px 14px',
                color: 'white', fontSize: '0.875rem', outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Compétences (séparées par virgule)
            </label>
            <input
              placeholder="Python, React, PostgreSQL"
              value={form.competences}
              onChange={e => setForm({ ...form, competences: e.target.value })}
              style={{
                width: '100%', backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '10px 14px',
                color: 'white', fontSize: '0.875rem', outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              placeholder="Décrivez le poste..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              style={{
                width: '100%', backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '10px 14px',
                color: 'white', fontSize: '0.875rem', outline: 'none',
                resize: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setOpen(false)}
              style={{
                padding: '10px 20px', borderRadius: '10px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.875rem', cursor: 'pointer'
              }}
            >Annuler</motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              disabled={loading}
              style={{
                padding: '10px 24px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none', color: 'white',
                fontSize: '0.875rem', fontWeight: '600',
                cursor: 'pointer'
              }}
            >{loading ? 'Ajout...' : '+ Ajouter'}</motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selected, setSelected] = useState<Candidate | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('hr_user')
    if (!stored) { router.push('/admin/login'); return }
    setUser(JSON.parse(stored))
    Promise.all([
      fetch('http://127.0.0.1:8000/candidates/').then(r => r.json()),
      fetch('http://127.0.0.1:8000/jobs/').then(r => r.json())
    ]).then(([c, j]) => {
      setCandidates(c)
      setJobs(j)
      setLoading(false)
    })
  }, [])

  const getScoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444'

  const getStatutStyle = (s: string) => ({
    'nouveau': { label: 'Nouveau', color: '#93c5fd', bg: 'rgba(59,130,246,0.15)' },
    'accepté': { label: 'Accepté', color: '#34d399', bg: 'rgba(16,185,129,0.15)' },
    'refusé': { label: 'Refusé', color: '#f87171', bg: 'rgba(239,68,68,0.12)' },
  }[s] || { label: 'Nouveau', color: '#93c5fd', bg: 'rgba(59,130,246,0.15)' })

  const getJobTitle = (id: number) => jobs.find(j => j.id === id)?.titre || 'N/A'

  const updateStatut = (id: number, statut: string) => {
    setCandidates(p => p.map(c => c.id === id ? { ...c, statut } : c))
    if (selected?.id === id) setSelected(p => p ? { ...p, statut } : null)
  }

  const filtered = candidates.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: candidates.length,
    nouveaux: candidates.filter(c => c.statut === 'nouveau').length,
    acceptes: candidates.filter(c => c.statut === 'accepté').length,
    refuses: candidates.filter(c => c.statut === 'refusé').length,
    avgScore: candidates.length > 0
      ? (candidates.reduce((a, b) => a + (b.match_score || 0), 0) / candidates.length).toFixed(1)
      : '0'
  }

  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'candidates', icon: '👥', label: 'Candidats' },
    { id: 'jobs', icon: '💼', label: 'Offres' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
  ]

  if (loading) return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: '36px', height: '36px', border: '2px solid rgba(99,102,241,0.2)', borderTop: '2px solid #6366f1', borderRadius: '50%' }}
      />
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', fontFamily: "'Inter', sans-serif", color: 'white', display: 'flex' }}>

      {/* Sidebar */}
      <aside style={{
        width: '64px',
        backgroundColor: '#111118',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '1.5rem 0', gap: '8px',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50
      }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', marginBottom: '1.5rem',
          boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          color: 'white', fontWeight: '800'
        }}>S</div>

        {navItems.map(item => (
          <motion.button
            key={item.id}
            whileHover={{ backgroundColor: 'rgba(99,102,241,0.15)' }}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            style={{
              width: '44px', height: '44px',
              borderRadius: '12px', border: 'none',
              backgroundColor: activeTab === item.id ? 'rgba(99,102,241,0.2)' : 'transparent',
              color: activeTab === item.id ? '#818cf8' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer', fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >{item.icon}</motion.button>
        ))}

        <div style={{ flex: 1 }}/>

        <motion.button
          whileHover={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
          onClick={() => { localStorage.removeItem('hr_user'); router.push('/admin/login') }}
          title="Déconnexion"
          style={{
            width: '44px', height: '44px', borderRadius: '12px',
            border: 'none', backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
            fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >🚪</motion.button>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: '64px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 2rem',
          backgroundColor: '#111118',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'sticky', top: 0, zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', padding: '8px 14px', width: '220px'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>🔍</span>
              <input
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: '0.85rem', width: '100%' }}
              />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.button whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }} style={{
              width: '36px', height: '36px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.9rem'
            }}>⚙</motion.button>
            <motion.button whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }} style={{
              width: '36px', height: '36px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.9rem'
            }}>🔔</motion.button>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer'
            }}>{user?.nom?.charAt(0) || 'H'}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', flex: 1 }}>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '4px' }}>
                  Bonjour, {user?.nom}! 👋
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>
                  Voici ce qui se passe dans votre système de recrutement.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Total candidats', value: stats.total, change: '+12%', color: '#6366f1' },
                  { label: 'Nouveaux', value: stats.nouveaux, change: '+5%', color: '#f59e0b' },
                  { label: 'Acceptés', value: stats.acceptes, change: '+8%', color: '#10b981' },
                  { label: 'Score moyen', value: `${stats.avgScore}%`, change: '+2%', color: '#8b5cf6' },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>{s.label}</span>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: s.color, fontSize: '0.7rem' }}>↗</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', letterSpacing: '-1px', marginBottom: '6px' }}>{s.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600' }}>{s.change}</span>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>vs mois dernier</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1rem' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>✓</div>
                  <div style={{ marginTop: '3rem' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-2px', marginBottom: '4px' }}>{stats.nouveaux}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '6px' }}>candidatures en attente</div>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
                      <span style={{ color: '#f59e0b' }}>{stats.nouveaux}</span> candidats attendent une réponse
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>👤</div>
                  <div style={{ marginTop: '3rem' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-2px', marginBottom: '4px' }}>{stats.total}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '6px' }}>candidats total</div>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
                      <span style={{ color: '#6366f1' }}>{stats.acceptes}</span> candidats sont <span style={{ color: '#34d399' }}>acceptés</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Match Scores</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>distribution</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
                    {candidates.slice(0, 8).map((c, i) => (
                      <motion.div key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max((c.match_score / 100) * 80, 8)}px` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        style={{ flex: 1, backgroundColor: i === candidates.length - 1 ? '#6366f1' : 'rgba(99,102,241,0.3)', borderRadius: '4px 4px 0 0' }}
                      />
                    ))}
                    {candidates.length === 0 && Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} style={{ flex: 1, height: '20px', backgroundColor: 'rgba(99,102,241,0.15)', borderRadius: '4px 4px 0 0' }}/>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    {['0', '20', '40', '60', '80', '100'].map(v => (
                      <span key={v} style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem' }}>{v}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Candidates Tab */}
          {activeTab === 'candidates' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px' }}>Liste des candidats</h1>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', marginTop: '4px' }}>{filtered.length} candidats trouvés</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Nouveaux', count: stats.nouveaux, color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
                  { label: 'En attente', count: stats.nouveaux, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
                  { label: 'Acceptés', count: stats.acceptes, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
                  { label: 'Refusés', count: stats.refuses, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
                ].map((s, i) => (
                  <div key={i} style={{ backgroundColor: s.bg, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: s.color, fontSize: '0.85rem', fontWeight: '600' }}>{s.label}</span>
                    <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>{s.count}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 2fr 1.5fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '1rem' }}>
                    {['#', 'Candidat', 'Poste', 'Score', 'Statut', 'Action'].map(h => (
                      <span key={h} style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</span>
                    ))}
                  </div>

                  {filtered.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Aucun candidat trouvé</div>
                  ) : filtered.map((c, i) => (
                    <motion.div key={c.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      onClick={() => setSelected(selected?.id === c.id ? null : c)}
                      style={{
                        display: 'grid', gridTemplateColumns: '0.5fr 2fr 1.5fr 1fr 1fr 1fr',
                        padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)',
                        gap: '1rem', alignItems: 'center', cursor: 'pointer',
                        backgroundColor: selected?.id === c.id ? 'rgba(99,102,241,0.05)' : 'transparent',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>#{c.id.toString().padStart(3, '0')}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0 }}>{c.nom.charAt(0)}</div>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white' }}>{c.nom}</p>
                          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>{c.email}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{getJobTitle(c.job_id)}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: getScoreColor(c.match_score || 0) }}>{(c.match_score || 0).toFixed(1)}%</span>
                      <span style={{ display: 'inline-block', backgroundColor: getStatutStyle(c.statut).bg, color: getStatutStyle(c.statut).color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '500' }}>{getStatutStyle(c.statut).label}</span>
                      <span style={{ color: '#6366f1', fontSize: '0.8rem' }}>{selected?.id === c.id ? '← Fermer' : 'Voir →'}</span>
                    </motion.div>
                  ))}
                </div>

                {selected && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content', position: 'sticky', top: '1rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Profil</h3>
                      <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: '800', margin: '0 auto 0.75rem' }}>{selected.nom.charAt(0)}</div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{selected.nom}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{selected.email}</p>
                    </div>
                    <div style={{ backgroundColor: `${getScoreColor(selected.match_score || 0)}15`, borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Match Score</p>
                      <div style={{ fontSize: '2.5rem', fontWeight: '800', color: getScoreColor(selected.match_score || 0), letterSpacing: '-1px' }}>{(selected.match_score || 0).toFixed(1)}%</div>
                    </div>
                    {[
                      { label: 'Téléphone', value: selected.telephone },
                      { label: 'Poste', value: getJobTitle(selected.job_id) },
                      { label: 'Statut', value: getStatutStyle(selected.statut).label },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{item.label}</span>
                        <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: '500' }}>{item.value}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => updateStatut(selected.id, 'accepté')}
                        style={{ flex: 1, backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                      >✓ Accepter</motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => updateStatut(selected.id, 'refusé')}
                        style={{ flex: 1, backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                      >✗ Refuser</motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px' }}>Offres d'emploi</h1>
                <AddJobForm onAdd={(job) => setJobs(p => [...p, job])} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {jobs.map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>💼</div>
                      <span style={{ backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', padding: '3px 12px', borderRadius: '20px', fontSize: '0.72rem' }}>● Active</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{job.titre}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '1rem' }}>{job.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {job.competences.split(',').map(s => (
                        <span key={s} style={{ backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem' }}>{s.trim()}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '1.5rem' }}>Analytics</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  {
                    title: 'Distribution des scores',
                    items: [
                      { label: 'Excellent (70%+)', count: candidates.filter(c => c.match_score >= 70).length, color: '#10b981' },
                      { label: 'Moyen (40-70%)', count: candidates.filter(c => c.match_score >= 40 && c.match_score < 70).length, color: '#f59e0b' },
                      { label: 'Faible (<40%)', count: candidates.filter(c => c.match_score < 40).length, color: '#ef4444' },
                    ]
                  },
                  {
                    title: 'Statuts des candidatures',
                    items: [
                      { label: 'Nouveaux', count: stats.nouveaux, color: '#6366f1' },
                      { label: 'Acceptés', count: stats.acceptes, color: '#10b981' },
                      { label: 'Refusés', count: stats.refuses, color: '#ef4444' },
                    ]
                  }
                ].map((section, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}
                  >
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)' }}>{section.title}</h3>
                    {section.items.map(item => (
                      <div key={item.label} style={{ marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: item.color }}>{item.count}</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: candidates.length > 0 ? `${(item.count / candidates.length) * 100}%` : '0%' }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ height: '100%', backgroundColor: item.color, borderRadius: '4px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}