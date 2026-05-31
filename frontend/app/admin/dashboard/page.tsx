'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users, Briefcase, BarChart3, Search, Bell,
  Settings, LogOut, X, FileText, CheckCircle,
  XCircle, ChevronRight, Plus, TrendingUp, Clock, Award, Brain
} from 'lucide-react'

// ─── CONFIGURATION ───────────────────────────────────
// 🚀 رابط الـ API الديناميكي ليعمل على أي سيرفر
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

// دالة مساعدة لجلب التوكن في أي وقت
const getToken = () => {
  if (typeof document !== 'undefined') {
    return document.cookie.split('hr_token=')[1]?.split(';')[0]
  }
  return null
}

// ─── TYPES ───────────────────────────────────────────
interface Candidate {
  id: number; nom: string; email: string; telephone: string
  job_id: number; match_score: number; statut: string
}
interface Job {
  id: number; titre: string; description: string
  competences: string; statut: string
}

// ─── TOAST SYSTEM ────────────────────────────────────
type ToastType = 'success' | 'error' | 'info'
interface ToastItem { id: number; message: string; type: ToastType }

function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 10, minWidth: 280,
              background: t.type === 'success' ? '#052e16' : t.type === 'error' ? '#2d0a0a' : '#0c1a2e',
              border: `1px solid ${t.type === 'success' ? '#166534' : t.type === 'error' ? '#7f1d1d' : '#1e3a5f'}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ fontSize: 15 }}>
              {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: t.type === 'success' ? '#4ade80' : t.type === 'error' ? '#f87171' : '#93c5fd' }}>
              {t.message}
            </span>
            <button onClick={() => onRemove(t.id)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 2, display: 'flex' }}
            ><X size={13}/></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toast = (message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random()   
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000)
  }
  const removeToast = (id: number) => setToasts(p => p.filter(t => t.id !== id))
  return { toasts, toast, removeToast }
}

// ─── CIRCULAR SCORE ──────────────────────────────────
function CircularScore({ score, size = 120 }: { score: number; size?: number }) {
  const r = (size - 14) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a2a" strokeWidth={8}/>
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.2, fontWeight: 800, color, letterSpacing: -1 }}>{score}%</span>
        <span style={{ fontSize: 9, color: '#71717a', letterSpacing: 1, fontFamily: 'monospace' }}>MATCH</span>
      </div>
    </div>
  )
}

// ─── BAR CHART ───────────────────────────────────────
function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 110, padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.value}</span>
          <motion.div
            initial={{ height: 0 }} animate={{ height: `${Math.max((d.value / max) * 80, d.value > 0 ? 8 : 4)}px` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            style={{ width: '100%', background: d.color, borderRadius: '4px 4px 0 0', opacity: 0.85, minHeight: 4 }}
          />
          <span style={{ fontSize: 10, color: '#71717a', textAlign: 'center', lineHeight: 1.3 }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── DONUT CHART ─────────────────────────────────────
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0)
  const size = 110; const r = 42; const circ = 2 * Math.PI * r
  let cumulative = 0
  const segments = data.map(d => {
    const pct = total > 0 ? d.value / total : 0
    const dash = pct * circ
    const seg = { ...d, dashOffset: circ - cumulative, dashArray: `${dash} ${circ - dash}` }
    cumulative += dash
    return seg
  })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a2a" strokeWidth={16}/>
        {total === 0 ? (
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a2a" strokeWidth={16}/>
        ) : segments.map((s, i) => (
          <motion.circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={s.color} strokeWidth={16}
            strokeDasharray={s.dashArray}
            strokeDashoffset={s.dashOffset}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }}/>
            <span style={{ fontSize: 12, color: '#a1a1aa', flex: 1 }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f4f4f5', fontFamily: 'monospace' }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── EDIT JOB MODAL ──────────────────────────────────
function EditJobModal({ job, onSave, onClose, showToast }: {
  job: Job; onSave: (j: Job) => void; onClose: () => void
  showToast: (msg: string, type: ToastType) => void
}) {
  const [form, setForm] = useState({ titre: job.titre, description: job.description, competences: job.competences })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!form.titre || !form.competences) return
    setLoading(true)
    try {
      const token = getToken();
      await fetch(`${API_URL}/jobs/${job.id}`, {
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify(form)
      })
      onSave({ ...job, ...form })
      showToast('Offre modifiée avec succès !', 'success')
      onClose()
    } finally { setLoading(false) }
  }

  const iStyle: React.CSSProperties = {
    width: '100%', background: '#111111', border: '1px solid #2a2a2a',
    borderRadius: 8, padding: '10px 12px', color: '#f4f4f5', fontSize: 13,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
    >
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 500 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', marginBottom: 2 }}>✏️ Modifier l'offre</h3>
            <p style={{ fontSize: 12, color: '#52525b' }}>{job.titre}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#a1a1aa' }}>
            <X size={14}/>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'titre', label: 'Titre du poste *', placeholder: 'ex: Développeur Full-Stack', type: 'input' },
            { key: 'competences', label: 'Compétences (séparées par virgule) *', placeholder: 'ex: Python, React, PostgreSQL', type: 'input' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 6 }}>{f.label}</label>
              <input value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder} style={iStyle}
                onFocus={e => e.target.style.borderColor = '#3f3f46'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
          ))}
          {form.competences && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {form.competences.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                <span key={s} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #2a2a2a', color: '#a1a1aa', padding: '2px 8px', borderRadius: 6, fontSize: 11 }}>{s}</span>
              ))}
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4} placeholder="Décrivez le poste..."
              style={{ ...iStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = '#3f3f46'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid #2a2a2a', color: '#a1a1aa', cursor: 'pointer', fontSize: 13 }}>Annuler</button>
            <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={loading}
              style={{ flex: 1, padding: '11px', borderRadius: 8, background: !form.titre ? '#2a2a2a' : '#ffffff', border: 'none', color: !form.titre ? '#52525b' : '#111111', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 14, height: 14, border: '2px solid #52525b', borderTop: '2px solid #a1a1aa', borderRadius: '50%' }}
                />
              ) : '✓ Sauvegarder'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── ADD JOB MODAL ───────────────────────────────────
function AddJobModal({ onAdd, onClose }: { onAdd: (j: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ titre: '', description: '', competences: '' })
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!form.titre || !form.competences) return
    setLoading(true)
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/jobs/`, { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }, 
        body: JSON.stringify(form) 
      })
      const data = await res.json()
      onAdd({ ...form, id: data.job_id, statut: 'active' })
      onClose()
    } finally { setLoading(false) }
  }

  const iStyle: React.CSSProperties = {
    width: '100%', background: '#111111', border: '1px solid #2a2a2a',
    borderRadius: 8, padding: '10px 12px', color: '#f4f4f5', fontSize: 13,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
    >
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5' }}>Nouvelle offre d'emploi</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#a1a1aa' }}>
            <X size={14}/>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'titre', label: 'Titre du poste *', placeholder: 'ex: Développeur Full-Stack' },
            { key: 'competences', label: 'Compétences requises *', placeholder: 'ex: Python, React, PostgreSQL' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 6 }}>{f.label}</label>
              <input value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder} style={iStyle}
                onFocus={e => e.target.style.borderColor = '#3f3f46'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Décrivez le poste..."
              style={{ ...iStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = '#3f3f46'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid #2a2a2a', color: '#a1a1aa', cursor: 'pointer', fontSize: 13 }}>Annuler</button>
            <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }} onClick={handleAdd} disabled={loading}
              style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#ffffff', border: 'none', color: '#111111', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
            >{loading ? 'Ajout...' : 'Créer l\'offre'}</motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── MAIN DASHBOARD ──────────────────────────────────
export default function Dashboard() {
  const router = useRouter()
  const { toasts, toast, removeToast } = useToast()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selected, setSelected] = useState<Candidate | null>(null)
  const [activeTab, setActiveTab] = useState('candidates')
  const [search, setSearch] = useState('')
  const [showAddJob, setShowAddJob] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('hr_user')
    const token = getToken()
    
    if (!stored || !token) { 
      document.cookie = 'hr_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
      document.cookie = 'hr_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' // Fallback
      window.location.replace('/admin/login')
      return 
    }

    try {
      setUser(JSON.parse(stored))
    } catch (e) {
      localStorage.removeItem('hr_user')
      document.cookie = 'hr_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
      window.location.replace('/admin/login')
      return
    }

    const fetchData = (isFirst = false) => {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      Promise.all([
        fetch(`${API_URL}/candidates/`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/jobs/`, { headers }).then(r => r.json()),
      ]).then(([c, j]) => {
        // 🛡️ درع الحماية الأقوى: ضمان أن البيانات مصفوفة دائماً
        const safeCandidates = Array.isArray(c) ? c : [];
        const safeJobs = Array.isArray(j) ? j : [];

        if (!isFirst) {
          setCandidates(prev => {
            if (safeCandidates.length > prev.length) {
              safeCandidates.slice(prev.length).forEach((n: Candidate) => {
                setNotifications(p => [`🆕 ${n.nom} a postulé`, ...p])
                toast(`Nouveau candidat: ${n.nom}`, 'info')
              })
            }
            return safeCandidates
          })
        } else { 
          setCandidates(safeCandidates) 
        }
        
        setJobs(safeJobs)
        setLoading(false)
      }).catch((err) => {
        console.error("Erreur réseau:", err)
        if(isFirst) { setCandidates([]); setJobs([]); setLoading(false); }
      })
    }

    fetchData(true)
    const interval = setInterval(() => fetchData(false), 10000)
    return () => clearInterval(interval)
  }, [])

  const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444'

  const statutTag = (s: string) => ({
    'nouveau':  { label: 'Nouveau',  bg: 'rgba(59,130,246,0.1)',  color: '#60a5fa', border: 'rgba(59,130,246,0.2)'  },
    'accepté':  { label: 'Accepté',  bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.2)' },
    'refusé':   { label: 'Refusé',   bg: 'rgba(239,68,68,0.1)',  color: '#f87171', border: 'rgba(239,68,68,0.2)'  },
  }[s] || { label: 'Nouveau', bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' })

  const getJobTitle = (id: number) => jobs.find(j => j.id === id)?.titre || 'N/A'

  const updateStatut = async (id: number, statut: string) => {
    const token = getToken();
    if (statut === 'refusé') {
      if (!confirm('Confirmer le refus et la suppression de ce candidat ?')) return
      setActionLoading('reject')
      await new Promise(r => setTimeout(r, 700))
      await fetch(`${API_URL}/applications/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setCandidates(p => p.filter(c => c.id !== id))
      if (selected?.id === id) setSelected(null)
      toast('Candidat refusé et supprimé', 'error')
      setActionLoading(null)
    } else {
      setActionLoading('accept')
      await new Promise(r => setTimeout(r, 700))
      await fetch(`${API_URL}/applications/${id}/statut`, {
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify({ statut })
      })
      setCandidates(p => p.map(c => c.id === id ? { ...c, statut } : c))
      if (selected?.id === id) setSelected(p => p ? { ...p, statut } : null)
      toast('✅ Candidat accepté avec succès !', 'success')
      setActionLoading(null)
    }
  }

  const deleteCandidate = async (id: number, nom: string) => {
    if (!confirm(`Supprimer ${nom} ?`)) return
    const token = getToken();
    await fetch(`${API_URL}/applications/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setCandidates(p => p.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
    toast(`${nom} supprimé`, 'error')
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Candidat', 'Email', 'Téléphone', 'Poste', 'Score IA (%)', 'Statut']
    const rows = candidates.map(c => [
      c.id, `"${c.nom}"`, `"${c.email}"`, `"${c.telephone}"`, `"${getJobTitle(c.job_id)}"`, c.match_score, c.statut
    ])
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }) 
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `rapport_candidats_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast('📥 Données exportées avec succès !', 'success')
  }

  // 🛡️ درع الحماية للفلترة
  const safeCandidates = Array.isArray(candidates) ? candidates : [];
  const filtered = safeCandidates.filter(c =>
    (c.nom || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: safeCandidates.length,
    nouveaux: safeCandidates.filter(c => c.statut === 'nouveau').length,
    acceptes: safeCandidates.filter(c => c.statut === 'accepté').length,
    refuses: safeCandidates.filter(c => c.statut === 'refusé').length,
    avgScore: safeCandidates.length > 0
      ? Math.round(safeCandidates.reduce((a, b) => a + (b.match_score || 0), 0) / safeCandidates.length)
      : 0,
  }

  const navItems = [
    { id: 'candidates', icon: <Users size={18}/>, label: 'Candidats' },
    { id: 'jobs', icon: <Briefcase size={18}/>, label: 'Offres' },
    { id: 'analytics', icon: <BarChart3 size={18}/>, label: 'Analytics' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, border: '2px solid #2a2a2a', borderTop: '2px solid #ffffff', borderRadius: '50%' }}
      />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#111111', fontFamily: "'Inter', -apple-system, sans-serif", color: '#f4f4f5', display: 'flex' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
        input::placeholder, textarea::placeholder { color: #52525b; }
      `}</style>

      <ToastContainer toasts={toasts} onRemove={removeToast}/>

      <AnimatePresence>
        {showAddJob && (
          <AddJobModal
            onAdd={j => { setJobs(p => [...p, j]); toast('Offre créée avec succès !', 'success') }}
            onClose={() => setShowAddJob(false)}
          />
        )}
        {editingJob && (
          <EditJobModal
            job={editingJob}
            onSave={updated => setJobs(p => p.map(j => j.id === updated.id ? updated : j))}
            onClose={() => setEditingJob(null)}
            showToast={toast}
          />
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ─── */}
      <aside style={{
        width: 56, background: '#111111', borderRight: '1px solid #1f1f1f',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '20px 0', gap: 4, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50
      }}>
        <div style={{ width: 32, height: 32, background: '#ffffff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#111111', marginBottom: 24, cursor: 'pointer', flexShrink: 0 }}>S</div>

        {navItems.map(item => (
          <motion.button key={item.id} whileHover={{ background: 'rgba(255,255,255,0.06)' }} whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(item.id)} title={item.label}
            style={{ width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer', background: activeTab === item.id ? 'rgba(255,255,255,0.08)' : 'transparent', color: activeTab === item.id ? '#ffffff' : '#52525b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', position: 'relative' }}
          >
            {item.icon}
            {activeTab === item.id && (
              <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 2, height: 16, background: '#ffffff', borderRadius: '0 2px 2px 0' }}/>
            )}
          </motion.button>
        ))}

        <div style={{ flex: 1 }}/>

        <Link href="/admin/settings">
          <motion.button whileHover={{ background: 'rgba(255,255,255,0.06)' }} title="Paramètres"
            style={{ width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: '#52525b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
          ><Settings size={18}/></motion.button>
        </Link>

        <motion.button whileHover={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }} title="Déconnexion"
          onClick={() => { 
            localStorage.removeItem('hr_user'); 
            document.cookie = 'hr_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'; 
            document.cookie = 'hr_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            window.location.replace('/admin/login');
          }}          
          style={{ width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: '#52525b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
        ><LogOut size={18}/></motion.button>
      </aside>

      {/* ─── MAIN ─── */}
      <div style={{ marginLeft: 56, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>

        {/* TOPBAR */}
        <div style={{ height: 56, background: '#111111', borderBottom: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 40, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 8, padding: '7px 12px', width: 240 }}>
              <Search size={14} color="#52525b"/>
              <input placeholder="Rechercher un candidat..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#f4f4f5', fontSize: 13, width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 20, padding: '4px 10px' }}>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}
              />
              <span style={{ fontSize: 11, color: '#34d399', fontWeight: 500 }}>Système actif</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#52525b' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>

            <div style={{ position: 'relative' }}>
              <motion.button whileHover={{ background: '#1c1c1c' }} onClick={() => setShowNotifs(!showNotifs)}
                style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #2a2a2a', background: 'transparent', color: '#71717a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.15s' }}
              >
                <Bell size={16}/>
                {notifications.length > 0 && (
                  <div style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white', border: '2px solid #111111' }}>
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </div>
                )}
              </motion.button>
              <AnimatePresence>
                {showNotifs && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    style={{ position: 'absolute', top: 44, right: 0, width: 300, background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, padding: '1rem', zIndex: 200, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5' }}>Notifications</span>
                      {notifications.length > 0 && (
                        <button onClick={() => setNotifications([])} style={{ background: 'none', border: 'none', color: '#52525b', cursor: 'pointer', fontSize: 11 }}>Effacer tout</button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#52525b', fontSize: 12 }}>Aucune notification</div>
                    ) : notifications.slice(0, 5).map((n, i) => (
                      <div key={i} style={{ padding: '8px 10px', background: '#111111', borderRadius: 8, marginBottom: 6, fontSize: 12, color: '#a1a1aa', border: '1px solid #1f1f1f' }}>{n}</div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#111111', cursor: 'pointer', flexShrink: 0 }}>
              {user?.nom?.charAt(0) || 'H'}
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>

          {/* ══ CANDIDATES TAB ══ */}
          {activeTab === 'candidates' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f4f4f5', letterSpacing: -0.5, marginBottom: 4 }}>Candidats</h1>
                  <p style={{ fontSize: 13, color: '#71717a' }}>{filtered.length} candidats · {stats.acceptes} acceptés · {stats.nouveaux} en attente</p>
                </div>
                
                {/* 🚀 زر التصدير السحري 🚀 */}
                <motion.button 
                  whileHover={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981', color: '#34d399' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportToCSV}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'transparent', border: '1px solid #2a2a2a', color: '#a1a1aa', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <FileText size={16} /> Exporter CSV
                </motion.button>
              </div>

              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Total candidats', value: stats.total, icon: <Users size={16}/>, color: '#60a5fa', delta: '+12%' },
                  { label: 'En attente', value: stats.nouveaux, icon: <Clock size={16}/>, color: '#fbbf24', delta: `${stats.nouveaux} actifs` },
                  { label: 'Acceptés', value: stats.acceptes, icon: <CheckCircle size={16}/>, color: '#34d399', delta: `${safeCandidates.length > 0 ? Math.round((stats.acceptes / safeCandidates.length) * 100) : 0}% taux` },
                  { label: 'Score IA moyen', value: `${stats.avgScore}%`, icon: <Award size={16}/>, color: '#a78bfa', delta: 'moyenne' },
                ].map((kpi, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, padding: '16px 18px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>{kpi.label}</span>
                      <div style={{ color: kpi.color, opacity: 0.7 }}>{kpi.icon}</div>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f4f4f5', letterSpacing: -1, marginBottom: 4 }}>{kpi.value}</div>
                    <div style={{ fontSize: 11, color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <TrendingUp size={11}/> {kpi.delta}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Table + Drawer */}
              <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 12 }}>
                <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, overflow: 'hidden' }}>
                  {/* Table Head */}
                  <div style={{ display: 'grid', gridTemplateColumns: '0.3fr 2fr 1.5fr 1.2fr 1fr 80px 36px', padding: '10px 18px', borderBottom: '1px solid #1f1f1f', gap: '1rem' }}>
                    {['#', 'Candidat', 'Poste', 'Score IA', 'Statut', 'Action', ''].map(h => (
                      <span key={h} style={{ fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{h}</span>
                    ))}
                  </div>

                  {filtered.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                      <Users size={32} color="#2a2a2a" style={{ margin: '0 auto 12px', display: 'block' }}/>
                      <p style={{ color: '#52525b', fontSize: 13 }}>Aucun candidat trouvé</p>
                    </div>
                  ) : filtered.map((c, i) => {
                    const tag = statutTag(c.statut)
                    return (
                      <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        style={{
                          display: 'grid', gridTemplateColumns: '0.3fr 2fr 1.5fr 1.2fr 1fr 80px 36px',
                          padding: '12px 18px', borderBottom: '1px solid #1a1a1a',
                          gap: '1rem', alignItems: 'center',
                          background: selected?.id === c.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                          transition: 'background 0.15s', cursor: 'default',
                        }}
                        onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                        onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'transparent' }}
                      >
                        <span style={{ fontSize: 11, color: '#3f3f46', fontFamily: 'monospace' }}>#{c.id.toString().padStart(3, '0')}</span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', minWidth: 0 }}
                          onClick={() => setSelected(selected?.id === c.id ? null : c)}
                        >
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2a2a2a', border: '1px solid #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, color: '#a1a1aa' }}>{(c.nom || 'X').charAt(0)}</div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nom}</p>
                            <p style={{ fontSize: 11, color: '#52525b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</p>
                          </div>
                        </div>

                        <span style={{ fontSize: 12, color: '#71717a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getJobTitle(c.job_id)}</span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 4, background: '#2a2a2a', borderRadius: 2, overflow: 'hidden', maxWidth: 60 }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${c.match_score || 0}%` }} transition={{ duration: 0.8 }}
                              style={{ height: '100%', background: scoreColor(c.match_score || 0), borderRadius: 2 }}
                            />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(c.match_score || 0), minWidth: 36, fontFamily: 'monospace' }}>{(c.match_score || 0).toFixed(0)}%</span>
                        </div>

                        <span style={{ display: 'inline-flex', alignItems: 'center', background: tag.bg, color: tag.color, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: `1px solid ${tag.border}`, width: 'fit-content' }}>{tag.label}</span>

                        <motion.button whileHover={{ background: 'rgba(255,255,255,0.08)' }} whileTap={{ scale: 0.96 }}
                          onClick={() => setSelected(selected?.id === c.id ? null : c)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: '1px solid #2a2a2a', background: selected?.id === c.id ? 'rgba(255,255,255,0.06)' : 'transparent', color: '#a1a1aa', fontSize: 11, cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                        >Profil <ChevronRight size={12}/></motion.button>

                        <motion.button whileHover={{ color: '#f87171' }} onClick={() => deleteCandidate(c.id, c.nom)}
                          style={{ background: 'none', border: 'none', color: '#3f3f46', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, transition: 'color 0.15s' }}
                        ><X size={14}/></motion.button>
                      </motion.div>
                    )
                  })}
                </div>

                {/* SIDE DRAWER */}
                <AnimatePresence>
                  {selected && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                      style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, height: 'fit-content', position: 'sticky', top: 0 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Profil candidat</span>
                        <motion.button whileHover={{ background: 'rgba(255,255,255,0.06)' }} onClick={() => setSelected(null)}
                          style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid #2a2a2a', color: '#71717a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        ><X size={13}/></motion.button>
                      </div>

                      {/* Avatar */}
                      <div style={{ textAlign: 'center', padding: '8px 0' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#2a2a2a', border: '1px solid #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#a1a1aa', margin: '0 auto 12px' }}>{(selected.nom || 'X').charAt(0)}</div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f4f4f5', marginBottom: 3 }}>{selected.nom}</h3>
                        <p style={{ fontSize: 12, color: '#71717a' }}>{selected.email}</p>
                      </div>

                      {/* Circular Score */}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularScore score={Math.round(selected.match_score || 0)} size={130}/>
                      </div>

                      {/* Info rows */}
                      <div style={{ background: '#111111', borderRadius: 10, overflow: 'hidden', border: '1px solid #1f1f1f' }}>
                        {[
                          { label: 'Téléphone', value: selected.telephone },
                          { label: 'Poste visé', value: getJobTitle(selected.job_id) },
                          { label: 'Statut', value: statutTag(selected.statut).label },
                        ].map((row, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < 2 ? '1px solid #1a1a1a' : 'none' }}>
                            <span style={{ fontSize: 12, color: '#52525b' }}>{row.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>{row.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* 🚀 AI EVALUATION BUTTON 🚀 */}
                      <motion.button
                        whileHover={{ background: 'rgba(6, 182, 212, 0.1)', borderColor: '#06b6d4', color: '#22d3ee', boxShadow: '0 0 15px rgba(6,182,212,0.2)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push(`/admin/candidats/${selected.id}`)}
                        style={{ width: '100%', padding: '12px', borderRadius: 8, background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid #2a2a2a', color: '#d4d4d8', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
                      >
                        <Brain size={16}/> Voir l'Analyse IA Détaillée
                      </motion.button>

                      {/* Accept / Reject */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <motion.button
                          whileHover={{ opacity: 0.85 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => updateStatut(selected.id, 'accepté')}
                          disabled={actionLoading !== null}
                          style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#10b981', border: 'none', color: 'white', cursor: actionLoading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: actionLoading === 'reject' ? 0.5 : 1, transition: 'all 0.15s' }}
                        >
                          {actionLoading === 'accept' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                              style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }}
                            />
                          ) : <><CheckCircle size={14}/> Accepter</>}
                        </motion.button>

                        <motion.button
                          whileHover={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)' }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => updateStatut(selected.id, 'refusé')}
                          disabled={actionLoading !== null}
                          style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: actionLoading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: actionLoading === 'accept' ? 0.5 : 1, transition: 'all 0.15s' }}
                        >
                          {actionLoading === 'reject' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                              style={{ width: 14, height: 14, border: '2px solid rgba(239,68,68,0.3)', borderTop: '2px solid #f87171', borderRadius: '50%' }}
                            />
                          ) : <><XCircle size={14}/> Refuser</>}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ══ JOBS TAB ══ */}
          {activeTab === 'jobs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f4f4f5', letterSpacing: -0.5, marginBottom: 4 }}>Offres d'emploi</h1>
                  <p style={{ fontSize: 13, color: '#71717a' }}>{jobs.length} offre{jobs.length > 1 ? 's' : ''} active{jobs.length > 1 ? 's' : ''}</p>
                </div>
                <motion.button whileHover={{ background: '#e4e4e7' }} whileTap={{ scale: 0.97 }} onClick={() => setShowAddJob(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', color: '#111111', padding: '9px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                ><Plus size={15}/> Nouvelle offre</motion.button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 12 }}>
                {jobs.map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, padding: '18px 20px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: '#2a2a2a', border: '1px solid #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Briefcase size={16} color="#71717a"/>
                      </div>
                      <span style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Active</span>
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f5', marginBottom: 6 }}>{job.titre}</h3>
                    <p style={{ fontSize: 12, color: '#71717a', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{job.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                      {job.competences.split(',').map(s => (
                        <span key={s} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #2a2a2a', color: '#a1a1aa', padding: '3px 8px', borderRadius: 6, fontSize: 11 }}>{s.trim()}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #1f1f1f' }}>
                      <span style={{ fontSize: 12, color: '#52525b' }}>{safeCandidates.filter(c => c.job_id === job.id).length} candidat(s)</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <motion.button
                          whileHover={{ background: 'rgba(255,255,255,0.06)', borderColor: '#3f3f46' }}
                          onClick={() => setEditingJob(job)}
                          style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #2a2a2a', background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: 12, transition: 'all 0.15s' }}
                        >Modifier</motion.button>
                        <motion.button
                          whileHover={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}
                          onClick={async () => {
                            if (!confirm(`Supprimer "${job.titre}" ?`)) return
                            const token = getToken();
                            await fetch(`${API_URL}/jobs/${job.id}`, { 
                              method: 'DELETE',
                              headers: { 'Authorization': `Bearer ${token}` }
                            })
                            setJobs(p => p.filter(j => j.id !== job.id))
                            toast('Offre supprimée', 'error')
                          }}
                          style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #2a2a2a', background: 'transparent', color: '#71717a', cursor: 'pointer', fontSize: 12, transition: 'all 0.15s' }}
                        >Supprimer</motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {jobs.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#52525b' }}>
                    <Briefcase size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }}/>
                    <p style={{ fontSize: 13 }}>Aucune offre créée. Cliquez sur "Nouvelle offre".</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ══ ANALYTICS TAB ══ */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f4f4f5', letterSpacing: -0.5, marginBottom: 4 }}>Analytics</h1>
                <p style={{ fontSize: 13, color: '#71717a' }}>Performance globale du recrutement</p>
              </div>

              {/* Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Taux d'acceptation", value: safeCandidates.length > 0 ? `${Math.round((stats.acceptes / safeCandidates.length) * 100)}%` : '0%', color: '#34d399' },
                  { label: 'Score moyen IA', value: `${stats.avgScore}%`, color: '#a78bfa' },
                  { label: 'Offres actives', value: jobs.length, color: '#60a5fa' },
                  { label: 'Total candidatures', value: safeCandidates.length, color: '#fbbf24' },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, padding: '18px 20px', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, letterSpacing: -1, marginBottom: 6 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: '#71717a' }}>{s.label}</div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, padding: '20px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', marginBottom: 20 }}>Hiring Pipeline</h3>
                  <BarChart data={[
                    { label: 'Total reçus', value: stats.total, color: '#60a5fa' },
                    { label: 'En revue', value: stats.nouveaux, color: '#a78bfa' },
                    { label: 'Acceptés', value: stats.acceptes, color: '#34d399' },
                    { label: 'Refusés', value: stats.refuses, color: '#f87171' },
                  ]}/>
                </div>

                <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, padding: '20px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', marginBottom: 20 }}>Distribution des Scores</h3>
                  <DonutChart data={[
                    { label: 'Excellent ≥70%', value: safeCandidates.filter(c => c.match_score >= 70).length, color: '#34d399' },
                    { label: 'Moyen 40-70%', value: safeCandidates.filter(c => c.match_score >= 40 && c.match_score < 70).length, color: '#fbbf24' },
                    { label: 'Faible <40%', value: safeCandidates.filter(c => c.match_score < 40).length, color: '#f87171' },
                  ]}/>
                  <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Nouveaux', count: stats.nouveaux, color: '#60a5fa' },
                      { label: 'Acceptés', count: stats.acceptes, color: '#34d399' },
                      { label: 'Refusés', count: stats.refuses, color: '#f87171' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: '#71717a' }}>{item.label}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: item.color, fontFamily: 'monospace' }}>{item.count}</span>
                        </div>
                        <div style={{ height: 4, background: '#2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: safeCandidates.length > 0 ? `${(item.count / safeCandidates.length) * 100}%` : '0%' }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            style={{ height: '100%', background: item.color, borderRadius: 2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}