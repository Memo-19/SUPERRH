'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Bot, Lock, Palette, Database,
  LayoutDashboard, Settings as SettingsIcon, LogOut,
  CheckCircle, AlertTriangle, Mail, Shield, Globe,
  Users, Briefcase, FileText, Inbox, Activity,
  Eye, EyeOff, Save, RefreshCw, Sun, Moon
} from 'lucide-react'

// 🌍 1. قاموس الترجمة الكامل
const dict = {
  fr: {
    title: "Paramètres Système", subtitle: "Gérez votre compte, l'IA et les préférences.",
    tabProfile: "Profil", tabSecurity: "Sécurité", tabAI: "Paramètres IA", tabApp: "Apparence", tabDB: "Base de données",
    profileInfo: "Informations personnelles", nameLabel: "Nom complet", emailLabel: "Email professionnel",
    saveProfile: "Enregistrer", saving: "Sauvegarde...", saved: "Profil mis à jour !",
    passTitle: "Changer le mot de passe", currentPass: "Mot de passe actuel", newPass: "Nouveau mot de passe", confirmPass: "Confirmer le nouveau",
    strShort: "Trop court", strMedium: "Moyen", strStrong: "Fort ✓", strength: "Force: ",
    updatePass: "Modifier le mot de passe", updating: "Modification...",
    aiTitle: "Seuil d'Acceptation IA", aiDesc: "Score minimum requis pour présélectionner automatiquement un candidat.",
    aiTol: "Tolérant (0%)", aiStrict: "Strict (100%)", updateAI: "Mettre à jour l'IA",
    themeTitle: "Thème", darkOpt: "Obsidian Dark", darkDesc: "Thème sombre optimisé", lightOpt: "Clean Light", lightDesc: "Thème clair & moderne",
    langTitle: "Langue", applyPrefs: "Appliquer les préférences",
    dbTitle: "Base de données — Live", refresh: "Actualiser",
    tblCand: "Candidats", tblJobs: "Offres", noCand: "Aucun candidat", noJobs: "Aucune offre", active: "Actif"
  },
  en: {
    title: "System Settings", subtitle: "Manage your account, AI, and preferences.",
    tabProfile: "Profile", tabSecurity: "Security", tabAI: "AI Settings", tabApp: "Appearance", tabDB: "Database",
    profileInfo: "Personal Information", nameLabel: "Full Name", emailLabel: "Professional Email",
    saveProfile: "Save Profile", saving: "Saving...", saved: "Profile updated!",
    passTitle: "Change Password", currentPass: "Current Password", newPass: "New Password", confirmPass: "Confirm Password",
    strShort: "Too short", strMedium: "Medium", strStrong: "Strong ✓", strength: "Strength: ",
    updatePass: "Update Password", updating: "Updating...",
    aiTitle: "AI Acceptance Threshold", aiDesc: "Minimum score required to automatically shortlist a candidate.",
    aiTol: "Tolerant (0%)", aiStrict: "Strict (100%)", updateAI: "Update AI",
    themeTitle: "Theme", darkOpt: "Obsidian Dark", darkDesc: "Optimized dark theme", lightOpt: "Clean Light", lightDesc: "Clean light theme",
    langTitle: "Language", applyPrefs: "Apply Preferences",
    dbTitle: "Database — Live", refresh: "Refresh",
    tblCand: "Candidates", tblJobs: "Jobs", noCand: "No candidates", noJobs: "No jobs", active: "Active"
  },
  ar: {
    title: "إعدادات النظام", subtitle: "إدارة الحساب، الذكاء الاصطناعي، والتفضيلات.",
    tabProfile: "الملف الشخصي", tabSecurity: "الأمان", tabAI: "إعدادات الذكاء", tabApp: "المظهر", tabDB: "قاعدة البيانات",
    profileInfo: "المعلومات الشخصية", nameLabel: "الاسم الكامل", emailLabel: "البريد المهني",
    saveProfile: "حفظ التغييرات", saving: "جاري الحفظ...", saved: "تم التحديث!",
    passTitle: "تغيير كلمة المرور", currentPass: "كلمة المرور الحالية", newPass: "كلمة المرور الجديدة", confirmPass: "تأكيد كلمة المرور",
    strShort: "ضعيف", strMedium: "متوسط", strStrong: "قوي ✓", strength: "القوة: ",
    updatePass: "تحديث كلمة المرور", updating: "تحديث...",
    aiTitle: "الحد الأدنى لقبول الذكاء الاصطناعي", aiDesc: "النتيجة المطلوبة لاختيار المرشح تلقائياً.",
    aiTol: "متساهل (0%)", aiStrict: "صارم (100%)", updateAI: "تحديث الذكاء الاصطناعي",
    themeTitle: "المظهر", darkOpt: "الوضع الداكن", darkDesc: "مظهر داكن ومريح", lightOpt: "الوضع الفاتح", lightDesc: "مظهر فاتح وحديث",
    langTitle: "اللغة", applyPrefs: "تطبيق التفضيلات",
    dbTitle: "قاعدة البيانات — مباشر", refresh: "تحديث",
    tblCand: "المرشحون", tblJobs: "الوظائف", noCand: "لا يوجد مرشحين", noJobs: "لا توجد وظائف", active: "نشط"
  }
}

// ─── TOAST ───
type ToastType = 'success' | 'error' | 'info'
interface ToastItem { id: number; message: string; type: ToastType }

function ToastContainer({ toasts, onRemove, isRtl }: { toasts: ToastItem[]; onRemove: (id: number) => void; isRtl: boolean }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, [isRtl ? 'left' : 'right']: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: isRtl ? -60 : 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: isRtl ? -60 : 60 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 12, minWidth: 280,
              background: t.type === 'success' ? 'rgba(16,185,129,0.12)' : t.type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(6,182,212,0.12)',
              border: `1px solid ${t.type === 'success' ? 'rgba(16,185,129,0.3)' : t.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(6,182,212,0.3)'}`,
              backdropFilter: 'blur(20px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            {t.type === 'success' ? <CheckCircle size={15} color="#34d399"/> : t.type === 'error' ? <AlertTriangle size={15} color="#f87171"/> : <Activity size={15} color="#22d3ee"/>}
            <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: t.type === 'success' ? '#34d399' : t.type === 'error' ? '#f87171' : '#22d3ee' }}>{t.message}</span>
            <button onClick={() => onRemove(t.id)} style={{ background: 'none', border: 'none', color: 'rgba(150,150,150,0.8)', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toast = (message: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000)
  }
  return { toasts, toast, removeToast: (id: number) => setToasts(p => p.filter(t => t.id !== id)) }
}

// ─── DATABASE VIEW ───
function DatabaseView({ isDark, langKey }: { isDark: boolean, langKey: 'fr'|'en'|'ar' }) {
  const t = dict[langKey]
  const [candidates, setCandidates] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTable, setActiveTable] = useState('candidates')
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    setRefreshing(true)
    try {
      const [c, j] = await Promise.all([
        fetch('http://127.0.0.1:8000/candidates/').then(r => r.json()),
        fetch('http://127.0.0.1:8000/jobs/').then(r => r.json()),
      ])
      setCandidates(c); setJobs(j)
    } catch { }
    finally { setLoading(false); setRefreshing(false) }
  }

  useEffect(() => { fetchData() }, [])

  const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444'
  const statutStyle = (s: string) => ({
    'nouveau':  { label: 'Nouveau',  color: '#60a5fa', bg: 'rgba(59,130,246,0.12)'  },
    'accepté':  { label: 'Accepté',  color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
    'refusé':   { label: 'Refusé',   color: '#f87171', bg: 'rgba(239,68,68,0.12)'  },
  }[s] || { label: 'Nouveau', color: '#60a5fa', bg: 'rgba(59,130,246,0.12)' })

  const getJobTitle = (id: number) => jobs.find(j => j.id === id)?.titre || 'N/A'

  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const textMuted = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
  const textMain = isDark ? 'white' : '#0f172a'

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, border: '3px solid rgba(6,182,212,0.2)', borderTop: '3px solid #06b6d4', borderRadius: '50%' }}
      />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 20, padding: '1.5rem', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Database size={20} color="#06b6d4"/>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: textMain }}>{t.dbTitle}</h2>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fetchData}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#22d3ee', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}
          >
            <motion.div animate={refreshing ? { rotate: 360 } : {}} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><RefreshCw size={13}/></motion.div>
            {t.refresh}
          </motion.button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: '1.25rem' }}>
          {[
            { label: 'candidates', count: candidates.length, color: '#06b6d4', Icon: Users },
            { label: 'jobs', count: jobs.length, color: '#10b981', Icon: Briefcase },
            { label: 'applications', count: candidates.length, color: '#f59e0b', Icon: FileText },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)', border: `1px solid ${borderColor}`, borderRadius: 14, padding: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, backgroundColor: `${s.color}15`, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.Icon size={18} color={s.color}/></div>
              <div>
                <p style={{ color: textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Table: {s.label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color, letterSpacing: -1 }}>{s.count}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'inline-flex', background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)', borderRadius: 11, padding: 3, border: `1px solid ${borderColor}` }}>
          {[{ id: 'candidates', label: t.tblCand, Icon: Users }, { id: 'jobs', label: t.tblJobs, Icon: Briefcase }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTable(tab.id)}
              style={{ padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, background: activeTable === tab.id ? (isDark ? 'rgba(255,255,255,0.1)' : 'white') : 'transparent', color: activeTable === tab.id ? textMain : textMuted, fontSize: 13, fontWeight: activeTable === tab.id ? 600 : 400, transition: 'all 0.2s', fontFamily: 'inherit', boxShadow: activeTable === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }}
            ><tab.Icon size={14}/> {tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ background: isDark ? 'rgba(255,255,255,0.01)' : 'white', border: `1px solid ${borderColor}`, borderRadius: 20, overflow: 'hidden', boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.06)' }}>
        {activeTable === 'candidates' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '0.4fr 1.5fr 2fr 1fr 1fr 1.2fr 1fr', padding: '0.9rem 1.5rem', background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', borderBottom: `1px solid ${borderColor}`, gap: '1rem' }}>
              {['ID', t.tabProfile, 'Email', 'Tel', 'Score', 'Status', 'Job'].map(h => <span key={h} style={{ fontSize: 10, color: textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{h}</span>)}
            </div>
            {candidates.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: textMuted }}><Inbox size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }}/><p style={{ fontSize: 13 }}>{t.noCand}</p></div>
            ) : candidates.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(6,182,212,0.03)' }} style={{ display: 'grid', gridTemplateColumns: '0.4fr 1.5fr 2fr 1fr 1fr 1.2fr 1fr', padding: '0.85rem 1.5rem', borderBottom: `1px solid ${borderColor}`, alignItems: 'center', gap: '1rem', transition: 'background 0.15s' }}>
                <span style={{ fontSize: 11, color: textMuted, fontFamily: 'monospace' }}>#{String(c.id).padStart(4,'0')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0 }}>{c.nom.charAt(0)}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: textMain }}>{c.nom}</span>
                </div>
                <span style={{ fontSize: 12, color: textMuted }}>{c.email}</span>
                <span style={{ fontSize: 12, color: textMuted }}>{c.telephone}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor(c.match_score || 0), fontFamily: 'monospace' }}>{(c.match_score || 0).toFixed(1)}%</span>
                <span style={{ display: 'inline-block', background: statutStyle(c.statut).bg, color: statutStyle(c.statut).color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{statutStyle(c.statut).label}</span>
                <span style={{ fontSize: 12, color: '#818cf8' }}>{getJobTitle(c.job_id)}</span>
              </motion.div>
            ))}
          </>
        )}
        {activeTable === 'jobs' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '0.4fr 2fr 3fr 2fr 1fr', padding: '0.9rem 1.5rem', background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', borderBottom: `1px solid ${borderColor}`, gap: '1rem' }}>
              {['ID', 'Titre', 'Description', 'Tech', 'Status'].map(h => <span key={h} style={{ fontSize: 10, color: textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{h}</span>)}
            </div>
            {jobs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: textMuted }}><Inbox size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }}/><p style={{ fontSize: 13 }}>{t.noJobs}</p></div>
            ) : jobs.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(6,182,212,0.03)' }} style={{ display: 'grid', gridTemplateColumns: '0.4fr 2fr 3fr 2fr 1fr', padding: '0.85rem 1.5rem', borderBottom: `1px solid ${borderColor}`, alignItems: 'center', gap: '1rem', transition: 'background 0.15s' }}>
                <span style={{ fontSize: 11, color: textMuted, fontFamily: 'monospace' }}>#{String(job.id).padStart(4,'0')}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: textMain }}>{job.titre}</span>
                <span style={{ fontSize: 12, color: textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.description}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {job.competences.split(',').slice(0, 3).map((s: string) => <span key={s} style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', border: `1px solid ${borderColor}`, color: isDark ? 'rgba(255,255,255,0.7)' : '#374151', padding: '2px 7px', borderRadius: 5, fontSize: 10 }}>{s.trim()}</span>)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#34d399', fontSize: 11, fontWeight: 600 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }}/>{t.active}
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ─── MAIN SETTINGS COMPONENT ───
export default function SettingsPage() {
  const router = useRouter()
  
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [isDark, setIsDark] = useState(true)
  const [language, setLanguage] = useState<'fr'|'en'|'ar'>('fr')

  const isRtl = language === 'ar'
  const { toasts, toast, removeToast } = useToast()
  const t = dict[language]

  const [profileForm, setProfileForm] = useState({ nom: '', email: '' })
  const [profileLoading, setProfileLoading] = useState(false)

  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' })
  const [passLoading, setPassLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [aiThreshold, setAiThreshold] = useState(75)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('hr_user')
    if (!stored) { router.push('/admin/login'); return }
    setUser(JSON.parse(stored))
    setProfileForm({ nom: JSON.parse(stored).nom || '', email: JSON.parse(stored).email || '' })
    
    setIsDark(localStorage.getItem('theme') !== 'light')
    const savedLang = localStorage.getItem('language') as 'fr'|'en'|'ar'
    if (savedLang) setLanguage(savedLang)
    
    setAiThreshold(Number(localStorage.getItem('ai_threshold') || 75))
  }, [router])

  const applyTheme = (dark: boolean) => {
    setIsDark(dark)
    document.body.style.backgroundColor = dark ? '#030303' : '#f1f5f9'
  }

  // ✅ تم تصحيح الروابط هنا لتشمل /auth/
  const handleSaveProfile = async () => {
    setProfileLoading(true)
    try {
      const res = await fetch(`http://127.0.0.1:8000/auth/users/${user?.id || 1}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: profileForm.nom, email: profileForm.email }),
      })
      if(res.ok){
         const updated = { ...user, nom: profileForm.nom, email: profileForm.email }
         localStorage.setItem('hr_user', JSON.stringify(updated))
         setUser(updated)
         toast(t.saved, 'success')
      }
    } catch {
      toast('Serveur inaccessible', 'error')
    } finally { setProfileLoading(false) }
  }

  // ✅ تم تصحيح الروابط هنا لتشمل /auth/
  const handleSavePassword = async () => {
    if (passForm.newPass !== passForm.confirm) { toast('Error', 'error'); return }
    setPassLoading(true)
    try {
      const res = await fetch(`http://127.0.0.1:8000/auth/users/${user?.id || 1}/password`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: passForm.current, new_password: passForm.newPass }),
      })
      if (res.ok) {
        toast('Mot de passe modifié !', 'success')
        setPassForm({ current: '', newPass: '', confirm: '' })
      } else {
        toast('Mot de passe actuel incorrect', 'error')
      }
    } catch {
      toast('Serveur inaccessible', 'error')
    } finally { setPassLoading(false) }
  }

  // ✅ تم تصحيح الروابط هنا لتشمل /auth/
  const handleSaveAI = async () => {
    setAiLoading(true)
    try {
      await fetch('http://127.0.0.1:8000/auth/settings/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ai_threshold: aiThreshold }),
      })
      localStorage.setItem('ai_threshold', aiThreshold.toString())
      toast(`🤖 IA configurée — Seuil: ${aiThreshold}%`, 'success')
    } catch { 
      toast('Serveur inaccessible', 'error') 
    } finally { setAiLoading(false) }
  }

  const handleSaveAppearance = () => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    localStorage.setItem('language', language)
    document.body.style.backgroundColor = isDark ? '#030303' : '#f1f5f9'
    toast(`🎨 Apparence appliquée !`, 'success')
  }

  const getAiColor = (v: number) => v > 80 ? '#10b981' : v > 50 ? '#06b6d4' : '#f59e0b'

  const bg = isDark ? '#030303' : '#f1f5f9'
  const sidebarBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.85)'
  const borderCol = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)'
  const textMain = isDark ? 'white' : '#0f172a'
  const textMuted = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.45)'
  const inpBg = isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.04)'
  const inpBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)'

  const glass: React.CSSProperties = {
    backgroundColor: cardBg, backdropFilter: 'blur(20px)',
    border: `1px solid ${borderCol}`, borderRadius: 22,
    padding: '1.75rem', boxShadow: isDark ? '0 20px 40px -12px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.08)',
  }

  const inpStyle: React.CSSProperties = {
    width: '100%', backgroundColor: inpBg, border: `1.5px solid ${inpBorder}`,
    borderRadius: 12, padding: '13px 16px', color: textMain,
    fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s', fontFamily: 'inherit',
  }

  const tabs = [
    { id: 'profile', icon: User, label: t.tabProfile },
    { id: 'password', icon: Shield, label: t.tabSecurity },
    { id: 'ai', icon: Bot, label: t.tabAI },
    { id: 'appearance', icon: Palette, label: t.tabApp },
    { id: 'database', icon: Database, label: t.tabDB },
  ]

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', sans-serif", color: textMain, display: 'flex', overflow: 'hidden', transition: 'all 0.4s' }}>
      <style>{`* { box-sizing: border-box; } input::placeholder { color: ${textMuted}; }`}</style>
      <ToastContainer toasts={toasts} onRemove={removeToast} isRtl={isRtl}/>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: isDark ? [0.15, 0.3, 0.15] : [0.05, 0.1, 0.05] }} transition={{ duration: 15, repeat: Infinity }}
          style={{ position: 'absolute', top: '-10%', [isRtl ? 'right' : 'left']: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)', filter: 'blur(100px)' }}
        />
      </div>

      <aside style={{ width: 74, margin: '1.25rem', backgroundColor: sidebarBg, backdropFilter: 'blur(20px)', border: `1px solid ${borderCol}`, borderRadius: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0', gap: 6, zIndex: 50, boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.1)', flexShrink: 0 }}>
        <Link href="/admin/dashboard" style={{ marginBottom: '1.5rem', textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.08 }} style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1.1rem' }}>S</motion.div>
        </Link>
        <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} style={{ width: 46, height: 46, borderRadius: 14, color: textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><LayoutDashboard size={19}/></motion.div>
        </Link>
        <div style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(6,182,212,0.12)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><SettingsIcon size={19}/></div>

        <div style={{ flex: 1 }}/>
        
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => applyTheme(!isDark)}
          style={{ width: 46, height: 46, borderRadius: 14, border: 'none', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}
        >{isDark ? <Sun size={18}/> : <Moon size={18}/>}</motion.button>
        <motion.button whileHover={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }} onClick={() => { localStorage.removeItem('hr_user'); router.push('/admin/login') }} style={{ width: 46, height: 46, borderRadius: 14, border: 'none', backgroundColor: 'transparent', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogOut size={19}/></motion.button>
      </aside>

      <div style={{ flex: 1, padding: isRtl ? '1.5rem 0 1.5rem 2rem' : '1.5rem 2rem 1.5rem 0', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.75rem', marginTop: '0.5rem', flexShrink: 0 }}>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: -1, marginBottom: 5, color: isDark ? '#fff' : '#0f172a' }}>{t.title}</h1>
          <p style={{ color: textMuted, fontSize: 14 }}>{t.subtitle}</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <motion.button key={tab.id} whileHover={{ x: isRtl ? -3 : 3 }} onClick={() => setActiveTab(tab.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px', borderRadius: 13, border: `1px solid ${isActive ? 'rgba(6,182,212,0.25)' : 'transparent'}`, cursor: 'pointer', backgroundColor: isActive ? (isDark ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.06)') : 'transparent', color: isActive ? '#22d3ee' : textMuted, fontSize: 13, fontWeight: isActive ? 600 : 400, textAlign: isRtl ? 'right' : 'left', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', fontFamily: 'inherit' }}
                >
                  {isActive && <motion.div layoutId="tabIndicator" style={{ position: 'absolute', [isRtl ? 'right' : 'left']: 0, top: 0, bottom: 0, width: 3, backgroundColor: '#06b6d4' }}/>}
                  <tab.icon size={15} strokeWidth={isActive ? 2.5 : 2}/>
                  {tab.label}
                </motion.button>
              )
            })}
          </div>

          <div style={{ overflowY: 'auto', paddingInlineEnd: 8, paddingBottom: '3rem' }}>
            <AnimatePresence mode="wait">
              {/* PROFILE */}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={glass}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8, color: textMain }}><User size={16} color="#06b6d4"/> {t.profileInfo}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem', marginBottom: '1.25rem' }}>
                      {[
                        { key: 'nom', label: t.nameLabel, icon: <User size={12}/> },
                        { key: 'email', label: t.emailLabel, icon: <Mail size={12}/> },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 5, color: textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{f.icon} {f.label}</label>
                          <input value={profileForm[f.key as keyof typeof profileForm]} onChange={e => setProfileForm({ ...profileForm, [f.key]: e.target.value })} style={inpStyle} />
                        </div>
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSaveProfile} disabled={profileLoading} style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: 'white', padding: '12px 26px', borderRadius: 11, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit', width: 'fit-content' }}>
                      {profileLoading ? <RefreshCw size={14}/> : <Save size={14}/>} {profileLoading ? t.saving : t.saveProfile}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* PASSWORD */}
              {activeTab === 'password' && (
                <motion.div key="password" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                  <div style={{ ...glass, maxWidth: 520 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8, color: textMain }}><Lock size={16} color="#8b5cf6"/> {t.passTitle}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.5rem' }}>
                      {[
                        { key: 'current', label: t.currentPass, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                        { key: 'newPass', label: t.newPass, show: showNew, toggle: () => setShowNew(!showNew) },
                        { key: 'confirm', label: t.confirmPass, show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: 'block', color: textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{f.label}</label>
                          <div style={{ position: 'relative' }}>
                            <input type={f.show ? 'text' : 'password'} placeholder="••••••••" value={passForm[f.key as keyof typeof passForm]} onChange={e => setPassForm({ ...passForm, [f.key]: e.target.value })} style={{ ...inpStyle, [isRtl ? 'paddingLeft' : 'paddingRight']: 44 }} />
                            <button onClick={f.toggle} style={{ position: 'absolute', [isRtl ? 'left' : 'right']: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: textMuted, cursor: 'pointer', padding: 0 }}>{f.show ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                          </div>
                        </div>
                      ))}
                      {passForm.newPass && (
                        <div>
                          <p style={{ fontSize: 11, color: passForm.newPass.length < 4 ? '#ef4444' : passForm.newPass.length < 8 ? '#f59e0b' : '#10b981' }}>
                            {t.strength} {passForm.newPass.length < 4 ? t.strShort : passForm.newPass.length < 8 ? t.strMedium : t.strStrong}
                          </p>
                        </div>
                      )}
                    </div>
                    <motion.button onClick={handleSavePassword} disabled={passLoading} style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', color: 'white', padding: '12px', borderRadius: 11, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit' }}>
                      <Shield size={14}/> {passLoading ? t.updating : t.updatePass}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* AI */}
              {activeTab === 'ai' && (
                <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ ...glass, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <Activity size={18} color={getAiColor(aiThreshold)}/>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: textMain }}>{t.aiTitle}</h3>
                        </div>
                        <p style={{ color: textMuted, fontSize: 13, lineHeight: 1.6 }}>{t.aiDesc}</p>
                      </div>
                      <motion.div style={{ padding: '7px 16px', borderRadius: 13, border: `1.5px solid ${getAiColor(aiThreshold)}`, color: getAiColor(aiThreshold), backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)', fontWeight: 900, fontSize: '1.5rem', flexShrink: 0 }}>{aiThreshold}%</motion.div>
                    </div>
                    <input type="range" min="0" max="100" value={aiThreshold} onChange={e => setAiThreshold(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: getAiColor(aiThreshold), height: 6, borderRadius: 10 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, color: textMuted, fontSize: 10, textTransform: 'uppercase' }}>
                      <span>{t.aiTol}</span><span>{t.aiStrict}</span>
                    </div>
                  </div>
                  <motion.button onClick={handleSaveAI} disabled={aiLoading} style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: 'white', padding: '12px 26px', borderRadius: 11, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit', width: 'fit-content' }}>
                     <Bot size={14}/> {t.updateAI}
                  </motion.button>
                </motion.div>
              )}

              {/* APPEARANCE */}
              {activeTab === 'appearance' && (
                <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ ...glass, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: 7, color: textMain }}><Palette size={15} color="#06b6d4"/> {t.themeTitle}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {[{ value: true, label: t.darkOpt, desc: t.darkDesc, icon: <Moon size={16}/> }, { value: false, label: t.lightOpt, desc: t.lightDesc, icon: <Sun size={16}/> }].map(th => (
                          <motion.div key={String(th.value)} whileHover={{ scale: 1.01 }} onClick={() => applyTheme(th.value)} style={{ padding: '0.9rem 1rem', borderRadius: 13, cursor: 'pointer', border: `1.5px solid ${isDark === th.value ? '#06b6d4' : borderCol}`, backgroundColor: isDark === th.value ? 'rgba(6,182,212,0.07)' : (isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.03)'), display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ color: isDark === th.value ? '#22d3ee' : textMuted }}>{th.icon}</div>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: 13, color: isDark === th.value ? '#22d3ee' : textMain }}>{th.label}</p>
                              <p style={{ fontSize: 11, color: textMuted }}>{th.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: 7, color: textMain }}><Globe size={15} color="#8b5cf6"/> {t.langTitle}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {[{ value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }, { value: 'ar', label: 'العربية' }].map(l => (
                          <motion.div key={l.value} whileHover={{ scale: 1.01 }} onClick={() => setLanguage(l.value as any)} style={{ padding: '0.9rem 1rem', borderRadius: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1.5px solid ${language === l.value ? '#8b5cf6' : borderCol}`, backgroundColor: language === l.value ? 'rgba(139,92,246,0.07)' : (isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.03)') }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: language === l.value ? '#a5b4fc' : textMain }}>{l.label}</span>
                            {language === l.value && <CheckCircle size={15} color="#8b5cf6"/>}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.button onClick={handleSaveAppearance} style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', color: textMain, padding: '12px 26px', borderRadius: 11, border: `1px solid ${borderCol}`, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit', width: 'fit-content' }}>
                    <Palette size={14}/> {t.applyPrefs}
                  </motion.button>
                </motion.div>
              )}

              {/* DATABASE */}
              {activeTab === 'database' && (
                <motion.div key="database" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                  <DatabaseView isDark={isDark} langKey={language} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}