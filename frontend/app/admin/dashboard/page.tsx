'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

function JobCard({ job, onUpdate, onDelete }: { job: Job; onUpdate: (j: Job) => void; onDelete: (id: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ titre: job.titre, description: job.description, competences: job.competences })
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await fetch(`http://127.0.0.1:8000/jobs/${job.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      onUpdate({ ...job, ...form })
      setEditing(false)
    } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    if (confirm(`Supprimer "${job.titre}" ?`)) {
      await fetch(`http://127.0.0.1:8000/jobs/${job.id}`, { method: 'DELETE' })
      onDelete(job.id)
    }
  }

  if (editing) return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(79,70,229,0.05))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#818cf8' }}>✏️ Modifier</h3>
      {[
        { key: 'titre', label: 'Titre', placeholder: 'Titre du poste' },
        { key: 'competences', label: 'Compétences', placeholder: 'Python, React...' },
      ].map(f => (
        <div key={f.key}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{f.label}</label>
          <input value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>
      ))}
      <div>
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '0.875rem', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '9px', borderRadius: '9px', background: 'rgba(0,0,0,0)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer' }}>Annuler</button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleUpdate} disabled={loading}
          style={{ flex: 1, padding: '9px', borderRadius: '9px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: 'white', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
        >{loading ? '...' : '✓ Enregistrer'}</motion.button>
      </div>
    </motion.div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(99,102,241,0.15)' }}
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem', transition: 'all 0.3s', cursor: 'default' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>💼</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(99,102,241,0.2)' }} onClick={() => setEditing(true)}
            style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✏️</motion.button>
          <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(239,68,68,0.2)' }} onClick={handleDelete}
            style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >🗑️</motion.button>
        </div>
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px', color: 'white' }}>{job.titre}</h3>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '1rem' }}>{job.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {job.competences.split(',').map(s => (
          <span key={s} style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '500' }}>{s.trim()}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 6px #10b981' }}/>
        <span style={{ color: '#34d399', fontSize: '0.72rem', fontWeight: '500' }}>Active</span>
      </div>
    </motion.div>
  )
}

function AddJobForm({ onAdd }: { onAdd: (job: any) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ titre: '', description: '', competences: '' })
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!form.titre || !form.description || !form.competences) return
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/jobs/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      onAdd({ ...form, id: data.job_id, statut: 'active' })
      setForm({ titre: '', description: '', competences: '' })
      setOpen(false)
    } finally { setLoading(false) }
  }

  return (
    <div>
      <motion.button whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.97 }} onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
      >
        <span style={{ fontSize: '1rem' }}>+</span> Nouvelle offre
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }}
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(79,70,229,0.04))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '1.5rem', marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', overflow: 'hidden' }}
          >
            {[
              { key: 'titre', label: 'Titre du poste', placeholder: 'Développeur Full-Stack', col: '1' },
              { key: 'competences', label: 'Compétences', placeholder: 'Python, React, PostgreSQL', col: '1' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{f.label}</label>
                <input placeholder={f.placeholder} value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Description</label>
              <textarea placeholder="Décrivez le poste..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '0.875rem', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setOpen(false)} style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(0,0,0,0)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', cursor: 'pointer' }}>Annuler</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAdd} disabled={loading}
                style={{ padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: 'white', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
              >{loading ? '...' : '+ Ajouter'}</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const [notifications, setNotifications] = useState<string[]>([])
  const [showNotifs, setShowNotifs] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('hr_user')
    if (!stored) { router.push('/admin/login'); return }
    setUser(JSON.parse(stored))
    const fetchData = (isFirst = false) => {
      Promise.all([
        fetch('http://127.0.0.1:8000/candidates/').then(r => r.json()),
        fetch('http://127.0.0.1:8000/jobs/').then(r => r.json())
      ]).then(([c, j]) => {
        if (!isFirst) {
          setCandidates(prev => {
            if (c.length > prev.length) {
              c.slice(prev.length).forEach((n: Candidate) => setNotifications(p => [`🆕 Nouveau: ${n.nom}`, ...p]))
            }
            return c
          })
        } else { setCandidates(c) }
        setJobs(j)
        setLoading(false)
      })
    }
    fetchData(true)
    const interval = setInterval(() => fetchData(false), 10000)
    return () => clearInterval(interval)
  }, [])

  const getScoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444'
  const getScoreBg = (s: number) => s >= 70 ? 'rgba(16,185,129,0.12)' : s >= 40 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)'
  const getStatut = (s: string) => ({ 'nouveau': { label: 'Nouveau', color: '#93c5fd', bg: 'rgba(59,130,246,0.15)' }, 'accepté': { label: 'Accepté', color: '#34d399', bg: 'rgba(16,185,129,0.15)' }, 'refusé': { label: 'Refusé', color: '#f87171', bg: 'rgba(239,68,68,0.12)' } }[s] || { label: 'Nouveau', color: '#93c5fd', bg: 'rgba(59,130,246,0.15)' })
  const getJobTitle = (id: number) => jobs.find(j => j.id === id)?.titre || 'N/A'

  const updateStatut = async (id: number, statut: string) => {
    if (statut === 'refusé') {
      if (confirm('Refuser et supprimer ce candidat ?')) {
        await fetch(`http://127.0.0.1:8000/applications/${id}`, { method: 'DELETE' })
        setCandidates(p => p.filter(c => c.id !== id))
        if (selected?.id === id) setSelected(null)
      }
    } else {
      await fetch(`http://127.0.0.1:8000/applications/${id}/statut`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statut }) })
      setCandidates(p => p.map(c => c.id === id ? { ...c, statut } : c))
      if (selected?.id === id) setSelected(p => p ? { ...p, statut } : null)
    }
  }

  const deleteCandidate = async (id: number, nom: string) => {
    if (confirm(`Supprimer ${nom} ?`)) {
      await fetch(`http://127.0.0.1:8000/applications/${id}`, { method: 'DELETE' })
      setCandidates(p => p.filter(c => c.id !== id))
      if (selected?.id === id) setSelected(null)
    }
  }

  const filtered = candidates.filter(c => c.nom.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  const stats = {
    total: candidates.length,
    nouveaux: candidates.filter(c => c.statut === 'nouveau').length,
    acceptes: candidates.filter(c => c.statut === 'accepté').length,
    refuses: candidates.filter(c => c.statut === 'refusé').length,
    avgScore: candidates.length > 0 ? (candidates.reduce((a, b) => a + (b.match_score || 0), 0) / candidates.length).toFixed(1) : '0'
  }

  const navItems = [
    { id: 'dashboard', icon: '▦', label: 'Dashboard' },
    { id: 'candidates', icon: '◈', label: 'Candidats' },
    { id: 'jobs', icon: '◉', label: 'Offres' },
    { id: 'analytics', icon: '◎', label: 'Analytics' },
  ]

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #1a1040 0%, #0a0a0f 60%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: '40px', height: '40px', border: '2px solid rgba(99,102,241,0.2)', borderTop: '2px solid #6366f1', borderRadius: '50%' }}
      />
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top left, #1a1040 0%, #0a0a0f 50%)', fontFamily: "'Inter', sans-serif", color: 'white', display: 'flex' }}>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        style={{ width: '72px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0', gap: '6px', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: '2rem', color: 'white', fontWeight: '900', boxShadow: '0 8px 25px rgba(99,102,241,0.5)', cursor: 'pointer' }}>S</motion.div>

        {navItems.map(item => (
          <motion.button key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab(item.id)} title={item.label}
            style={{ width: '48px', height: '48px', borderRadius: '14px', border: 'none', background: activeTab === item.id ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))' : 'rgba(0,0,0,0)', color: activeTab === item.id ? '#a5b4fc' : 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: activeTab === item.id ? '0 4px 15px rgba(99,102,241,0.2)' : 'none', position: 'relative' }}
          >
            {item.icon}
            {activeTab === item.id && (
              <motion.div layoutId="activeIndicator" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '20px', background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)', borderRadius: '0 4px 4px 0' }}/>
            )}
          </motion.button>
        ))}

        <div style={{ flex: 1 }}/>

        <motion.button whileHover={{ scale: 1.05, background: 'rgba(239,68,68,0.15)' }}
          onClick={() => { localStorage.removeItem('hr_user'); router.push('/admin/login') }}
          style={{ width: '48px', height: '48px', borderRadius: '14px', border: 'none', background: 'rgba(0,0,0,0)', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
        >🚪</motion.button>
      </motion.aside>

      {/* Main */}
      <div style={{ marginLeft: '72px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Topbar */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 40 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '8px 16px', width: '240px' }}>
              <span style={{ fontSize: '0.9rem' }}>🔍</span>
              <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: '0.875rem', width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '4px 12px' }}>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}
              />
              <span style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: '500' }}>Système actif</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>

            <Link href="/admin/settings">
              <motion.div whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                style={{ width: '38px', height: '38px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', transition: 'all 0.2s' }}
              >⚙️</motion.div>
            </Link>

            <div style={{ position: 'relative' }}>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowNotifs(!showNotifs)}
                style={{ width: '38px', height: '38px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1rem', position: 'relative' }}
              >
                🔔
                {notifications.length > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '700', color: 'white', border: '2px solid #0a0a0f' }}
                  >{notifications.length}</motion.div>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    style={{ position: 'absolute', top: '48px', right: 0, width: '320px', background: 'rgba(15,12,30,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '1.25rem', zIndex: 200, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Notifications</span>
                      {notifications.length > 0 && (
                        <button onClick={() => setNotifications([])} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px' }}>Effacer tout</button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔕</div>
                        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>Aucune notification</p>
                      </div>
                    ) : notifications.map((n, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', marginBottom: '8px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}
                      >{n}</motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div whileHover={{ scale: 1.05 }}
              style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
            >{user?.nom?.charAt(0) || 'H'}</motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <div style={{ padding: '2rem', flex: 1 }}>

          {/* ═══════════════ DASHBOARD TAB ═══════════════ */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

              {/* Welcome */}
              <div style={{ marginBottom: '2rem' }}>
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '6px', background: 'linear-gradient(135deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >Bonjour, {user?.nom}! 👋</motion.h1>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>Voici un aperçu de votre activité de recrutement</p>
              </div>

              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Total candidats', value: stats.total, icon: '👥', color: '#6366f1', gradient: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))' },
                  { label: 'En attente', value: stats.nouveaux, icon: '⏳', color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))' },
                  { label: 'Acceptés', value: stats.acceptes, icon: '✅', color: '#10b981', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))' },
                  { label: 'Score moyen', value: `${stats.avgScore}%`, icon: '🎯', color: '#8b5cf6', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))' },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4, boxShadow: `0 20px 40px ${s.color}20` }}
                    style={{ background: s.gradient, border: `1px solid ${s.color}25`, borderRadius: '20px', padding: '1.5rem', cursor: 'default', transition: 'all 0.3s' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ width: '44px', height: '44px', background: `${s.color}20`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', border: `1px solid ${s.color}30` }}>{s.icon}</div>
                      <span style={{ fontSize: '0.7rem', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '20px', fontWeight: '600' }}>↗ +12%</span>
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', letterSpacing: '-1px', marginBottom: '4px' }}>{s.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.8fr', gap: '1rem' }}>

                {/* Pending */}
                <motion.div whileHover={{ y: -4 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.03))', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '20px', padding: '1.5rem', transition: 'all 0.3s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', background: 'rgba(245,158,11,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>⏳</div>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>En attente</span>
                  </div>
                  <div style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-2px', color: '#fbbf24', lineHeight: 1 }}>{stats.nouveaux}</div>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', marginTop: '8px' }}>candidatures à traiter</p>
                </motion.div>

                {/* Accepted */}
                <motion.div whileHover={{ y: -4 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.03))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '1.5rem', transition: 'all 0.3s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', background: 'rgba(16,185,129,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✅</div>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Acceptés</span>
                  </div>
                  <div style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-2px', color: '#34d399', lineHeight: 1 }}>{stats.acceptes}</div>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', marginTop: '8px' }}>candidats retenus</p>
                </motion.div>

                {/* Chart */}
                <motion.div whileHover={{ y: -4 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '20px', padding: '1.5rem', transition: 'all 0.3s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>Match Scores</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>Distribution des candidats</p>
                    </div>
                    <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600' }}>{candidates.length} CVs</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '70px' }}>
                    {candidates.slice(0, 10).map((c, i) => (
                      <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${Math.max((c.match_score / 100) * 70, 6)}px` }} transition={{ delay: i * 0.05, duration: 0.6, ease: 'easeOut' }}
                        style={{ flex: 1, background: `linear-gradient(to top, ${getScoreColor(c.match_score)}, ${getScoreColor(c.match_score)}80)`, borderRadius: '4px 4px 0 0', cursor: 'pointer' }}
                        title={`${c.nom}: ${c.match_score}%`}
                      />
                    ))}
                    {candidates.length === 0 && Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} style={{ flex: 1, height: '8px', background: 'rgba(99,102,241,0.1)', borderRadius: '4px 4px 0 0' }}/>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {['0%', '25%', '50%', '75%', '100%'].map(v => (
                      <span key={v} style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.62rem' }}>{v}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════ CANDIDATES TAB ═══════════════ */}
          {activeTab === 'candidates' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px', background: 'linear-gradient(135deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Candidats</h1>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginTop: '4px' }}>{filtered.length} candidats trouvés</p>
                </div>
              </div>

              {/* Status Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Nouveaux', count: stats.nouveaux, color: '#6366f1', bg: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.08))' },
                  { label: 'En attente', count: stats.nouveaux, color: '#f59e0b', bg: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.08))' },
                  { label: 'Acceptés', count: stats.acceptes, color: '#10b981', bg: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.08))' },
                  { label: 'Refusés', count: stats.refuses, color: '#ef4444', bg: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.08))' },
                ].map((s, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.02 }}
                    style={{ background: s.bg, borderRadius: '16px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default' }}
                  >
                    <span style={{ color: s.color, fontSize: '0.85rem', fontWeight: '600' }}>{s.label}</span>
                    <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px' }}>{s.count}</span>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1rem' }}>

                {/* Table */}
                <motion.div layout style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '0.4fr 2fr 1.5fr 1fr 1fr 0.8fr 0.4fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                    {['#', 'Candidat', 'Poste', 'Score', 'Statut', 'Action', ''].map(h => (
                      <span key={h} style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>{h}</span>
                    ))}
                  </div>

                  {filtered.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>Aucun candidat trouvé</p>
                    </div>
                  ) : filtered.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      whileHover={{ background: 'rgba(99,102,241,0.05)' }}
                      style={{ display: 'grid', gridTemplateColumns: '0.4fr 2fr 1.5fr 1fr 1fr 0.8fr 0.4fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', gap: '1rem', alignItems: 'center', background: selected?.id === c.id ? 'rgba(99,102,241,0.08)' : 'rgba(0,0,0,0)', transition: 'all 0.15s', cursor: 'default' }}
                    >
                      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem', fontFamily: 'monospace' }}>#{c.id.toString().padStart(3, '0')}</span>

                      <div onClick={() => setSelected(selected?.id === c.id ? null : c)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800', flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>{c.nom.charAt(0)}</div>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'white' }}>{c.nom}</p>
                          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>{c.email}</p>
                        </div>
                      </div>

                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getJobTitle(c.job_id)}</span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${c.match_score || 0}%` }} transition={{ duration: 0.8, delay: i * 0.04 }}
                            style={{ height: '100%', background: getScoreColor(c.match_score || 0), borderRadius: '4px' }}
                          />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: getScoreColor(c.match_score || 0), minWidth: '38px' }}>{(c.match_score || 0).toFixed(1)}%</span>
                      </div>

                      <span style={{ display: 'inline-block', background: getStatut(c.statut).bg, color: getStatut(c.statut).color, padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600' }}>{getStatut(c.statut).label}</span>

                      <motion.button whileHover={{ scale: 1.05 }} onClick={() => setSelected(selected?.id === c.id ? null : c)}
                        style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: selected?.id === c.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', color: selected?.id === c.id ? '#a5b4fc' : 'rgba(255,255,255,0.35)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                      >{selected?.id === c.id ? '✕' : 'Voir'}</motion.button>

                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteCandidate(c.id, c.nom)}
                        style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.5)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      >🗑</motion.button>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Side Drawer */}
                <AnimatePresence>
                  {selected && (
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))', backdropFilter: 'blur(20px)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '24px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', height: 'fit-content', position: 'sticky', top: '1rem' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Profil candidat</h3>
                        <motion.button whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }} onClick={() => setSelected(null)}
                          style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >×</motion.button>
                      </div>

                      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                          style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: '900', margin: '0 auto 1rem', boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}
                        >{selected.nom.charAt(0)}</motion.div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '4px' }}>{selected.nom}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>{selected.email}</p>
                      </div>

                      {/* Score */}
                      <div style={{ background: getScoreBg(selected.match_score || 0), border: `1px solid ${getScoreColor(selected.match_score || 0)}30`, borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Match Score</p>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: getScoreColor(selected.match_score || 0), letterSpacing: '-2px', lineHeight: 1 }}>{(selected.match_score || 0).toFixed(1)}%</div>
                        <div style={{ marginTop: '10px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${selected.match_score || 0}%` }} transition={{ duration: 1 }}
                            style={{ height: '100%', background: getScoreColor(selected.match_score || 0), borderRadius: '4px' }}
                          />
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '6px' }}>
                          {(selected.match_score || 0) >= 70 ? '🎯 Excellent profil!' : (selected.match_score || 0) >= 40 ? '👍 Bon profil' : '📝 Profil partiel'}
                        </p>
                      </div>

                      {/* Info */}
                      {[
                        { label: 'Téléphone', value: selected.telephone, icon: '📞' },
                        { label: 'Poste visé', value: getJobTitle(selected.job_id), icon: '💼' },
                        { label: 'Statut actuel', value: getStatut(selected.statut).label, icon: '📌' },
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}><span>{item.icon}</span>{item.label}</span>
                          <span style={{ color: 'white', fontSize: '0.82rem', fontWeight: '600' }}>{item.value}</span>
                        </div>
                      ))}

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <motion.button whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(16,185,129,0.3)' }} whileTap={{ scale: 0.97 }}
                          onClick={() => updateStatut(selected.id, 'accepté')}
                          style={{ flex: 1, background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '12px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' }}
                        >✓ Accepter</motion.button>
                        <motion.button whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(239,68,68,0.2)' }} whileTap={{ scale: 0.97 }}
                          onClick={() => updateStatut(selected.id, 'refusé')}
                          style={{ flex: 1, background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08))', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '12px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' }}
                        >✗ Refuser</motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ═══════════════ JOBS TAB ═══════════════ */}
          {activeTab === 'jobs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px', background: 'linear-gradient(135deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Offres d'emploi</h1>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginTop: '4px' }}>{jobs.length} offre{jobs.length > 1 ? 's' : ''} active{jobs.length > 1 ? 's' : ''}</p>
                </div>
                <AddJobForm onAdd={(job) => setJobs(p => [...p, job])} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job}
                    onUpdate={(updated) => setJobs(p => p.map(j => j.id === updated.id ? updated : j))}
                    onDelete={(id) => setJobs(p => p.filter(j => j.id !== id))}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════════════ ANALYTICS TAB ═══════════════ */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px', background: 'linear-gradient(135deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics</h1>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginTop: '4px' }}>Vue d'ensemble des performances</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {[
                  { title: 'Distribution des scores', icon: '🎯', items: [
                    { label: 'Excellent (≥70%)', count: candidates.filter(c => c.match_score >= 70).length, color: '#10b981', max: candidates.length },
                    { label: 'Moyen (40-70%)', count: candidates.filter(c => c.match_score >= 40 && c.match_score < 70).length, color: '#f59e0b', max: candidates.length },
                    { label: 'Faible (<40%)', count: candidates.filter(c => c.match_score < 40).length, color: '#ef4444', max: candidates.length },
                  ]},
                  { title: 'Statuts des candidatures', icon: '📊', items: [
                    { label: 'Nouveaux', count: stats.nouveaux, color: '#6366f1', max: candidates.length },
                    { label: 'Acceptés', count: stats.acceptes, color: '#10b981', max: candidates.length },
                    { label: 'Refusés', count: stats.refuses, color: '#ef4444', max: candidates.length },
                  ]}
                ].map((section, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.75rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{section.icon}</span>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>{section.title}</h3>
                    </div>
                    {section.items.map((item, j) => (
                      <div key={j} style={{ marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: item.color }}>{item.count}</span>
                            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>/{item.max}</span>
                          </div>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: item.max > 0 ? `${(item.count / item.max) * 100}%` : '0%' }} transition={{ duration: 1, delay: j * 0.1 }}
                            style={{ height: '100%', background: `linear-gradient(to right, ${item.color}, ${item.color}80)`, borderRadius: '8px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '20px', padding: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}
              >
                {[
                  { label: 'Taux d\'acceptation', value: candidates.length > 0 ? `${((stats.acceptes / candidates.length) * 100).toFixed(0)}%` : '0%', color: '#10b981' },
                  { label: 'Score moyen', value: `${stats.avgScore}%`, color: '#6366f1' },
                  { label: 'Offres actives', value: jobs.length, color: '#f59e0b' },
                  { label: 'Total candidatures', value: candidates.length, color: '#8b5cf6' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: s.color, letterSpacing: '-1px', marginBottom: '4px' }}>{s.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

        </div>
      </div>
    </main>
  )
}