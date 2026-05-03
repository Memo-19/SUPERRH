'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('fr')
  const [saved, setSaved] = useState(false)

  const [profileForm, setProfileForm] = useState({ nom: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('hr_user')
    if (!stored) { router.push('/admin/login'); return }
    const u = JSON.parse(stored)
    setUser(u)
    setProfileForm({ nom: u.nom || '', email: u.email || 'hr@ats.com' })
    const savedTheme = localStorage.getItem('theme') || 'dark'
    const savedLang = localStorage.getItem('language') || 'fr'
    setTheme(savedTheme)
    setLanguage(savedLang)
  }, [])

  const handleSaveProfile = () => {
    const updated = { ...user, nom: profileForm.nom }
    localStorage.setItem('hr_user', JSON.stringify(updated))
    setUser(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSavePassword = async () => {
    setPasswordError('')
    setPasswordSuccess(false)
    if (passwordForm.current !== '1234') {
      setPasswordError('Mot de passe actuel incorrect')
      return
    }
    if (passwordForm.new.length < 4) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 4 caractères')
      return
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError('Les mots de passe ne correspondent pas')
      return
    }
    setPasswordSuccess(true)
    setPasswordForm({ current: '', new: '', confirm: '' })
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  const handleSaveAppearance = () => {
    localStorage.setItem('theme', theme)
    localStorage.setItem('language', language)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'profile', icon: '👤', label: 'Profil' },
    { id: 'password', icon: '🔒', label: 'Mot de passe' },
    { id: 'appearance', icon: '🎨', label: 'Apparence' },
    { id: 'database', icon: '🗄️', label: 'Base de données' },
  ]

  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard', href: '/admin/dashboard' },
    { id: 'settings', icon: '⚙', label: 'Paramètres', href: '/admin/settings' },
  ]

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', fontFamily: "'Inter', sans-serif", color: 'white', display: 'flex' }}>

      {/* Sidebar */}
      <aside style={{ width: '64px', backgroundColor: '#111118', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0', gap: '8px', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <Link href="/admin/dashboard">
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', marginBottom: '1.5rem', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>S</div>
        </Link>

        {navItems.map(item => (
          <Link key={item.id} href={item.href} title={item.label}>
            <motion.div whileHover={{ backgroundColor: 'rgba(99,102,241,0.15)' }}
              style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: item.id === 'settings' ? 'rgba(99,102,241,0.2)' : 'rgba(0,0,0,0)', color: item.id === 'settings' ? '#818cf8' : 'rgba(255,255,255,0.3)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            >{item.icon}</motion.div>
          </Link>
        ))}

        <div style={{ flex: 1 }}/>
        <motion.button whileHover={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
          onClick={() => { localStorage.removeItem('hr_user'); router.push('/admin/login') }}
          style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0)', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >🚪</motion.button>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: '64px', flex: 1, padding: '2rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '4px' }}>Paramètres ⚙️</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>Gérez votre compte et les préférences du système</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem' }}>

          {/* Left Nav */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tab => (
              <motion.button key={tab.id} whileHover={{ backgroundColor: 'rgba(99,102,241,0.1)' }}
                onClick={() => setActiveTab(tab.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === tab.id ? 'rgba(99,102,241,0.15)' : 'rgba(0,0,0,0)', color: activeTab === tab.id ? '#818cf8' : 'rgba(255,255,255,0.45)', fontSize: '0.875rem', fontWeight: activeTab === tab.id ? '600' : '400', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Right Content */}
          <div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem' }}
              >
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Informations du profil</h2>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', marginBottom: '2rem' }}>Modifiez vos informations personnelles</p>

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
                    {user?.nom?.charAt(0) || 'H'}
                  </div>
                  <div>
                    <p style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{user?.nom}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginBottom: '8px' }}>HR Manager</p>
                    <span style={{ backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', padding: '3px 12px', borderRadius: '20px', fontSize: '0.72rem' }}>● Actif</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Nom complet</label>
                    <input value={profileForm.nom} onChange={e => setProfileForm({ ...profileForm, nom: e.target.value })}
                      style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Email</label>
                    <input value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                      style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Rôle</label>
                    <input value="HR Manager" disabled
                      style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 16px', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Système</label>
                    <input value="SUPERRH v1.0" disabled
                      style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 16px', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
                  >Enregistrer les modifications</motion.button>
                  {saved && (
                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      style={{ color: '#34d399', fontSize: '0.875rem' }}
                    >✓ Enregistré!</motion.span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem' }}
              >
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Changer le mot de passe</h2>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', marginBottom: '2rem' }}>Assurez-vous d'utiliser un mot de passe sécurisé</p>

                {passwordError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '1.5rem', color: '#f87171', fontSize: '0.875rem' }}
                  >⚠ {passwordError}</motion.div>
                )}

                {passwordSuccess && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '1.5rem', color: '#34d399', fontSize: '0.875rem' }}
                  >✓ Mot de passe modifié avec succès!</motion.div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '500px' }}>
                  {[
                    { key: 'current', label: 'Mot de passe actuel', placeholder: '••••••••' },
                    { key: 'new', label: 'Nouveau mot de passe', placeholder: '••••••••' },
                    { key: 'confirm', label: 'Confirmer le mot de passe', placeholder: '••••••••' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{field.label}</label>
                      <input
                        type="password"
                        placeholder={field.placeholder}
                        value={passwordForm[field.key as keyof typeof passwordForm]}
                        onChange={e => setPasswordForm({ ...passwordForm, [field.key]: e.target.value })}
                        style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                    </div>
                  ))}

                  <div style={{ padding: '1rem', backgroundColor: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '10px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '6px' }}>Exigences:</p>
                    {[
                      { text: 'Au moins 4 caractères', valid: passwordForm.new.length >= 4 },
                      { text: 'Les mots de passe correspondent', valid: passwordForm.new === passwordForm.confirm && passwordForm.new.length > 0 },
                    ].map((req, i) => (
                      <p key={i} style={{ fontSize: '0.8rem', color: req.valid ? '#34d399' : 'rgba(255,255,255,0.25)', marginBottom: '2px' }}>
                        {req.valid ? '✓' : '○'} {req.text}
                      </p>
                    ))}
                  </div>

                  <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.98 }}
                    onClick={handleSavePassword}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', width: 'fit-content' }}
                  >Changer le mot de passe</motion.button>
                </div>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem' }}
              >
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Apparence & Langue</h2>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', marginBottom: '2rem' }}>Personnalisez l'interface selon vos préférences</p>

                {/* Theme */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>Thème</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '500px' }}>
                    {[
                      { value: 'dark', label: 'Mode Sombre', icon: '🌙', desc: 'Interface sombre (actuel)' },
                      { value: 'light', label: 'Mode Clair', icon: '☀️', desc: 'Interface claire' },
                    ].map(t => (
                      <motion.div key={t.value} whileHover={{ scale: 1.02 }} onClick={() => setTheme(t.value)}
                        style={{ padding: '1.25rem', borderRadius: '14px', cursor: 'pointer', border: theme === t.value ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.08)', backgroundColor: theme === t.value ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', transition: 'all 0.2s' }}
                      >
                        <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t.icon}</div>
                        <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px', color: theme === t.value ? '#818cf8' : 'white' }}>{t.label}</p>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{t.desc}</p>
                        {theme === t.value && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                            <div style={{ width: '6px', height: '6px', backgroundColor: '#6366f1', borderRadius: '50%' }}/>
                            <span style={{ fontSize: '0.7rem', color: '#818cf8' }}>Sélectionné</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>Langue de l'interface</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '500px' }}>
                    {[
                      { value: 'fr', label: 'Français', flag: '🇫🇷' },
                      { value: 'en', label: 'English', flag: '🇬🇧' },
                      { value: 'ar', label: 'العربية', flag: '🇲🇦' },
                    ].map(l => (
                      <motion.div key={l.value} whileHover={{ scale: 1.02 }} onClick={() => setLanguage(l.value)}
                        style={{ padding: '1rem', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', border: language === l.value ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.08)', backgroundColor: language === l.value ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', transition: 'all 0.2s' }}
                      >
                        <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{l.flag}</div>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: language === l.value ? '#818cf8' : 'white' }}>{l.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.98 }}
                    onClick={handleSaveAppearance}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
                  >Enregistrer les préférences</motion.button>
                  {saved && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#34d399', fontSize: '0.875rem' }}>✓ Enregistré!</motion.span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Database Tab */}
            {activeTab === 'database' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <DatabaseView />
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </main>
  )
}

function DatabaseView() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTable, setActiveTable] = useState('candidates')

  useEffect(() => {
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

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: '36px', height: '36px', border: '2px solid rgba(99,102,241,0.2)', borderTop: '2px solid #6366f1', borderRadius: '50%' }}
      />
    </div>
  )

  return (
    <div>
      <div style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Base de données PostgreSQL 🗄️</h2>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Visualisez toutes les données en temps réel</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'candidates', count: candidates.length, color: '#6366f1', icon: '👥' },
            { label: 'jobs', count: jobs.length, color: '#10b981', icon: '💼' },
            { label: 'applications', count: candidates.length, color: '#f59e0b', icon: '📋' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: `${s.color}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{s.icon}</div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontFamily: 'monospace', marginBottom: '2px' }}>table: {s.label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '800', color: s.color, letterSpacing: '-1px' }}>{s.count}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
          {[
            { id: 'candidates', label: '👥 Candidates' },
            { id: 'jobs', label: '💼 Jobs' },
          ].map(tab => (
            <motion.button key={tab.id} whileHover={{ scale: 1.02 }} onClick={() => setActiveTable(tab.id)}
              style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: activeTable === tab.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', color: activeTable === tab.id ? '#818cf8' : 'rgba(255,255,255,0.4)', fontSize: '0.875rem', fontWeight: activeTable === tab.id ? '600' : '400' }}
            >{tab.label}</motion.button>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      {activeTable === 'candidates' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1.5fr 2fr 1fr 1fr 1.2fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '1rem', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            {['ID', 'Nom', 'Email', 'Téléphone', 'Score', 'Statut', 'Poste'].map(h => (
              <span key={h} style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>{h}</span>
            ))}
          </div>
          {candidates.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
              Aucun candidat
            </div>
          ) : candidates.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              whileHover={{ backgroundColor: 'rgba(99,102,241,0.04)' }}
              style={{ display: 'grid', gridTemplateColumns: '0.5fr 1.5fr 2fr 1fr 1fr 1.2fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: '1rem', alignItems: 'center' }}
            >
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', fontFamily: 'monospace' }}>#{c.id.toString().padStart(3, '0')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', flexShrink: 0 }}>{c.nom.charAt(0)}</div>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{c.nom}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{c.email}</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{c.telephone}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: getScoreColor(c.match_score || 0), fontFamily: 'monospace' }}>{(c.match_score || 0).toFixed(1)}%</span>
              <span style={{ display: 'inline-block', backgroundColor: getStatutStyle(c.statut).bg, color: getStatutStyle(c.statut).color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '500' }}>{getStatutStyle(c.statut).label}</span>
              <span style={{ fontSize: '0.8rem', color: '#818cf8' }}>{getJobTitle(c.job_id)}</span>
            </motion.div>
          ))}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>{candidates.length} enregistrements</span>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem', fontFamily: 'monospace' }}>Table: candidates | PostgreSQL</span>
          </div>
        </motion.div>
      )}

      {/* Jobs Table */}
      {activeTable === 'jobs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 2fr 3fr 2fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '1rem', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            {['ID', 'Titre', 'Description', 'Compétences', 'Statut'].map(h => (
              <span key={h} style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>{h}</span>
            ))}
          </div>
          {jobs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
              Aucune offre
            </div>
          ) : jobs.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              whileHover={{ backgroundColor: 'rgba(99,102,241,0.04)' }}
              style={{ display: 'grid', gridTemplateColumns: '0.5fr 2fr 3fr 2fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: '1rem', alignItems: 'center' }}
            >
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', fontFamily: 'monospace' }}>#{job.id.toString().padStart(3, '0')}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{job.titre}</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.description}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {job.competences.split(',').slice(0, 3).map((s: string) => (
                  <span key={s} style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>{s.trim()}</span>
                ))}
              </div>
              <span style={{ display: 'inline-block', backgroundColor: 'rgba(16,185,129,0.12)', color: '#34d399', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem' }}>● Active</span>
            </motion.div>
          ))}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>{jobs.length} enregistrements</span>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem', fontFamily: 'monospace' }}>Table: jobs | PostgreSQL</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}