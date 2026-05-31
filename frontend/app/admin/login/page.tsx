'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, ChevronLeft, Send, ShieldCheck, CheckCircle } from 'lucide-react'

type Mode = 'login' | 'signup' | 'forgot' | 'reset'

export default function AdminLogin() {
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
  const [mode, setMode] = useState<Mode>('login')
  const [form, setForm] = useState({ nom: '', email: '', password: '', confirm: '', code: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [focused, setFocused] = useState('')

  const switchMode = (m: Mode) => {
    setError(''); setSuccess('')
    if (m !== 'reset' && m !== 'forgot') {
        setForm({ nom: '', email: '', password: '', confirm: '', code: '' })
    }
    setMode(m)
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) return
    setLoading(true); setError('')
    try {
      // تم إصلاح علامات التنصيص هنا
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('hr_user', JSON.stringify(data.user))
        document.cookie = `hr_token=${data.access_token}; path=/; SameSite=Strict`       
        router.push('/admin/dashboard')
      } else {
        setError(data.detail || 'Identifiants incorrects')
      }
    } catch {
      setError('Impossible de contacter le serveur')
    } finally { setLoading(false) }
  }

  const handleSignup = async () => {
    if (!form.nom || !form.email || !form.password) return
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas'); return }
    setLoading(true); setError('')
    try {
      // ربط دالة التسجيل بالباك أند بشكل حقيقي
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: form.nom, email: form.email, password: form.password }),
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess('Compte créé ! Vous pouvez vous connecter.')
        setTimeout(() => switchMode('login'), 1800)
      } else {
        setError(data.detail || 'Erreur lors de la création du compte')
      }
    } catch {
      setError('Impossible de contacter le serveur')
    } finally { setLoading(false) }
  }

  const handleForgot = async () => {
    if (!form.email) { setError('Veuillez entrer votre adresse email'); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      // تم إصلاح علامات التنصيص هنا
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      })

      if (res.ok) {
        setSuccess('Un code à 6 chiffres a été envoyé à votre email !')
        setTimeout(() => { switchMode('reset'); setSuccess(''); setError('') }, 2500)
      } else {
        const data = await res.json()
        setError(data.detail || "Erreur lors de l'envoi de l'email")
      }
    } catch {
      setError("Erreur de connexion au serveur")
    } finally { setLoading(false) }
  }

  const handleResetPassword = async () => {
    if (!form.code || !form.password || !form.confirm) return
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas'); return }
    
    setLoading(true); setError(''); setSuccess('')
    try {
      // تم إصلاح علامات التنصيص هنا
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: form.code, new_password: form.password })
      })
      if (res.ok) {
        setSuccess('Mot de passe modifié avec succès ! Vous pouvez vous connecter.')
        setTimeout(() => switchMode('login'), 3000)
      } else {
        const data = await res.json()
        setError(data.detail || "Code invalide ou expiré")
      }
    } catch {
      setError("Erreur de connexion au serveur")
    } finally { setLoading(false) }
  }

  const canLogin = !!(form.email && form.password)
  const canSignup = !!(form.nom && form.email && form.password && form.confirm && form.password === form.confirm)
  const canForgot = !!form.email
  const canReset = !!(form.code && form.password && form.confirm && form.password === form.confirm)

  const IS = (name: string, extra?: React.CSSProperties): React.CSSProperties => ({
    width: '100%', padding: '14px 14px 14px 44px',
    border: `1.5px solid ${focused === name ? '#0891b2' : '#e4e8ee'}`,
    borderRadius: 14, fontSize: 14, color: '#18181b', background: '#fafafa',
    outline: 'none', boxSizing: 'border-box' as const, transition: 'all 0.2s',
    boxShadow: focused === name ? '0 0 0 4px rgba(8,145,178,0.1)' : 'none',
    fontFamily: 'inherit', ...extra,
  })

  return (
    <main style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden' }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px #fafafa inset !important; -webkit-text-fill-color: #18181b !important; }`}</style>

      {/* BACKGROUND */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f4f4f5', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '58%', clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)', zIndex: 1, overflow: 'hidden' }}>
        <img src="/hero.jpg" alt="BG" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(10px)', transform: 'scale(1.1)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10, 15, 26, 0.85)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ width: '100%', maxWidth: 1090, height: 600, background: 'white', borderRadius: 45, padding: '12px', boxShadow: '0 40px 100px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.02)', position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: 35, overflow: 'hidden', display: 'flex', background: 'white' }}>
          
          <div style={{ width: '56%', height: '100%', position: 'absolute', left: 0, top: 0, clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)', zIndex: 10 }}>
            <img src="/hero.jpg" alt="SuperRH" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)' }}/>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2.5rem', zIndex: 10 }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #06b6d4, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 17, color: 'white', boxShadow: '0 0 20px rgba(6,182,212,0.5)' }}>S</div>
                <span style={{ fontWeight: 800, fontSize: 18, color: 'white', letterSpacing: -0.5 }}>Super<span style={{ color: '#22d3ee' }}>RH</span></span>
              </Link>
            </div>
          </div>

          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 3.5rem', background: 'white', zIndex: 0 }}>
            
            <div style={{ position: 'absolute', top: '2rem', right: '2.5rem', display: 'flex', background: '#f4f6f8', borderRadius: 30, padding: 3 }}>
              {(['login', 'signup'] as Mode[]).map(m => (
                <button key={m} onClick={() => switchMode(m)} style={{ padding: '6px 16px', borderRadius: 26, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: mode === m ? 'white' : 'transparent', color: mode === m ? '#18181b' : '#94a3b8', boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s', fontFamily: 'inherit' }}>{m === 'login' ? 'Connexion' : 'Créer un compte'}</button>
              ))}
            </div>

            <div style={{ width: '100%', marginTop: '1rem' }}>
              <AnimatePresence mode="wait">

                {/* ─── LOGIN ─── */}
                {mode === 'login' && (
                  <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#18181b', letterSpacing: -1.2, marginBottom: 6, lineHeight: 1.1 }}>Connexion</h1>
                    <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: '1.5rem' }}>Accédez à votre espace administrateur SuperRH.</p>
                    {error && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}><Lock size={13}/> {error}</motion.div>}
                    <div style={{ marginBottom: '1.1rem' }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Adresse Email</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'email' ? '#0891b2' : '#cbd5e1', transition: 'color 0.2s', pointerEvents: 'none' }}/>
                        <input type="email" placeholder="hr@entreprise.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleLogin()} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} style={IS('email')} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mot de passe</label>
                        <button type="button" onClick={() => switchMode('forgot')} style={{ background: 'none', border: 'none', fontSize: 12, color: '#0891b2', cursor: 'pointer', fontWeight: 600, padding: 0, fontFamily: 'inherit' }}>Oublié ?</button>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Lock size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'pass' ? '#0891b2' : '#cbd5e1', transition: 'color 0.2s', pointerEvents: 'none' }}/>
                        <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleLogin()} onFocus={() => setFocused('pass')} onBlur={() => setFocused('')} style={IS('pass', { paddingRight: 46 })} />
                        <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 0 }}>{showPass ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                      </div>
                    </div>
                    <motion.button whileHover={canLogin ? { opacity: 0.9, y: -1 } : {}} whileTap={canLogin ? { scale: 0.98 } : {}} onClick={handleLogin} disabled={loading || !canLogin} style={{ width: '100%', padding: '15px', background: canLogin ? '#0891b2' : '#e4e8ee', color: canLogin ? 'white' : '#94a3b8', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: canLogin ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', marginBottom: '1.5rem', boxShadow: canLogin ? '0 8px 24px rgba(8,145,178,0.3)' : 'none', fontFamily: 'inherit' }}>
                      {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><Loader2 size={16}/></motion.div> : <>Accéder à l'espace <ArrowRight size={16}/></>}
                    </motion.button>
                  </motion.div>
                )}

                {/* ─── SIGNUP ─── */}
                {mode === 'signup' && (
                  <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    <button type="button" onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 13, marginBottom: 10, padding: 0, fontFamily: 'inherit', fontWeight: 600 }}><ChevronLeft size={15}/> Retour</button>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#18181b', letterSpacing: -1, marginBottom: 4, lineHeight: 1.1 }}>Créer un compte</h1>
                    <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: '1.2rem' }}>Rejoignez l'avenir du recrutement avec SuperRH.</p>
                    {error && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}><Lock size={13}/> {error}</motion.div>}
                    {success && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 8 }}>✓ {success}</motion.div>}

                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nom complet</label>
                      <div style={{ position: 'relative' }}>
                        <User size={14} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'nom' ? '#0891b2' : '#cbd5e1', transition: 'color 0.2s', pointerEvents: 'none' }}/>
                        <input type="text" placeholder="Ahmed Benali" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} onFocus={() => setFocused('nom')} onBlur={() => setFocused('')} style={IS('nom', { padding: '12px 12px 12px 42px' })} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Professionnel</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={14} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'emailS' ? '#0891b2' : '#cbd5e1', transition: 'color 0.2s', pointerEvents: 'none' }}/>
                        <input type="email" placeholder="rh@entreprise.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={() => setFocused('emailS')} onBlur={() => setFocused('')} style={IS('emailS', { padding: '12px 12px 12px 42px' })} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mot de passe</label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={14} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'passS' ? '#0891b2' : '#cbd5e1', transition: 'color 0.2s', pointerEvents: 'none' }}/>
                          <input type={showPass ? 'text' : 'password'} placeholder="••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onFocus={() => setFocused('passS')} onBlur={() => setFocused('')} style={IS('passS', { padding: '12px 35px 12px 42px' })} />
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Confirmer</label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={14} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'confirm' ? '#0891b2' : '#cbd5e1', transition: 'color 0.2s', pointerEvents: 'none' }}/>
                          <input type={showPass ? 'text' : 'password'} placeholder="••••••" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleSignup()} onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')} style={IS('confirm', { padding: '12px 12px 12px 42px' })} />
                        </div>
                      </div>
                    </div>
                    <motion.button whileHover={canSignup ? { opacity: 0.9, y: -1 } : {}} whileTap={canSignup ? { scale: 0.98 } : {}} onClick={handleSignup} disabled={loading || !canSignup} style={{ width: '100%', padding: '15px', background: canSignup ? '#0891b2' : '#e4e8ee', color: canSignup ? 'white' : '#94a3b8', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: canSignup ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', boxShadow: canSignup ? '0 8px 24px rgba(8,145,178,0.3)' : 'none', fontFamily: 'inherit' }}>
                      {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><Loader2 size={16}/></motion.div> : <>Créer l'espace admin <ArrowRight size={16}/></>}
                    </motion.button>
                  </motion.div>
                )}

                {/* ─── FORGOT PASSWORD ─── */}
                {mode === 'forgot' && (
                  <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    <button type="button" onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 13, marginBottom: 10, padding: 0, fontFamily: 'inherit', fontWeight: 600 }}><ChevronLeft size={15}/> Retour</button>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#18181b', letterSpacing: -1, marginBottom: 6, lineHeight: 1.1 }}>Mot de passe oublié ?</h1>
                    <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.5 }}>Entrez l'adresse email associée à votre compte pour recevoir le code de sécurité.</p>
                    {error && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}><Lock size={13}/> {error}</motion.div>}
                    {success && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 8 }}>✓ {success}</motion.div>}

                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Adresse Email</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'emailF' ? '#0891b2' : '#cbd5e1', transition: 'color 0.2s', pointerEvents: 'none' }}/>
                        <input type="email" placeholder="hr@entreprise.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleForgot()} onFocus={() => setFocused('emailF')} onBlur={() => setFocused('')} style={IS('emailF')} />
                      </div>
                    </div>
                    <motion.button whileHover={canForgot ? { opacity: 0.9, y: -1 } : {}} whileTap={canForgot ? { scale: 0.98 } : {}} onClick={handleForgot} disabled={loading || !canForgot} style={{ width: '100%', padding: '15px', background: canForgot ? '#0891b2' : '#e4e8ee', color: canForgot ? 'white' : '#94a3b8', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: canForgot ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', marginBottom: '1.5rem', boxShadow: canForgot ? '0 8px 24px rgba(8,145,178,0.3)' : 'none', fontFamily: 'inherit' }}>
                      {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><Loader2 size={16}/></motion.div> : <>Envoyer le code <Send size={16}/></>}
                    </motion.button>
                  </motion.div>
                )}

                {/* ─── 🚀 RESET PASSWORD 🚀 ─── */}
                {mode === 'reset' && (
                  <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#18181b', letterSpacing: -1, marginBottom: 6, lineHeight: 1.1 }}>Nouveau mot de passe</h1>
                    <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.5 }}>Un code a été envoyé à <b>{form.email}</b>. Veuillez le saisir ci-dessous.</p>
                    
                    {error && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}><Lock size={13}/> {error}</motion.div>}
                    {success && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 8 }}>✓ {success}</motion.div>}

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Code de vérification (6 chiffres)</label>
                      <div style={{ position: 'relative' }}>
                        <ShieldCheck size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'code' ? '#0891b2' : '#cbd5e1', transition: 'color 0.2s', pointerEvents: 'none' }}/>
                        <input type="text" placeholder="123456" maxLength={6} value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} onFocus={() => setFocused('code')} onBlur={() => setFocused('')} style={IS('code', { letterSpacing: 4, fontWeight: 'bold' })} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nouveau Pass</label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={14} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'passR' ? '#0891b2' : '#cbd5e1' }}/>
                          <input type={showPass ? 'text' : 'password'} placeholder="••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onFocus={() => setFocused('passR')} onBlur={() => setFocused('')} style={IS('passR', { padding: '12px 35px 12px 42px' })} />
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Confirmer</label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={14} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused === 'confirmR' ? '#0891b2' : '#cbd5e1' }}/>
                          <input type={showPass ? 'text' : 'password'} placeholder="••••••" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleResetPassword()} onFocus={() => setFocused('confirmR')} onBlur={() => setFocused('')} style={IS('confirmR', { padding: '12px 12px 12px 42px' })} />
                        </div>
                      </div>
                    </div>

                    <motion.button whileHover={canReset ? { opacity: 0.9, y: -1 } : {}} whileTap={canReset ? { scale: 0.98 } : {}} onClick={handleResetPassword} disabled={loading || !canReset} style={{ width: '100%', padding: '15px', background: canReset ? '#0891b2' : '#e4e8ee', color: canReset ? 'white' : '#94a3b8', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: canReset ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', marginBottom: '1.5rem', boxShadow: canReset ? '0 8px 24px rgba(8,145,178,0.3)' : 'none', fontFamily: 'inherit' }}>
                      {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><Loader2 size={16}/></motion.div> : <>Réinitialiser le mot de passe <CheckCircle size={16}/></>}
                    </motion.button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}