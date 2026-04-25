'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!form.email || !form.password) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('hr_user', JSON.stringify(data.user))
        router.push('/admin/dashboard')
      } else {
        setError(data.detail || 'Identifiants incorrects')
      }
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#020608',
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/buildings.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.15) saturate(0.5)',
        }}/>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(2,6,8,0.9) 0%, rgba(2,6,8,0.7) 100%)'
        }}/>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '30%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}/>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          backgroundColor: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          margin: '1rem'
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <motion.div
                animate={{ boxShadow: ['0 0 6px #3b82f6', '0 0 14px #3b82f6', '0 0 6px #3b82f6'] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '50%' }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '2px', color: 'white' }}>SUPERRH</span>
            </div>
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '0.5rem' }}>
            Espace RH
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>
            Connectez-vous pour accéder au dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '1.5rem',
              color: '#f87171',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ⚠ {error}
          </motion.div>
        )}

        {/* Email */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{
            display: 'block',
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.75rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>Email</label>
          <input
            type="email"
            placeholder="hr@superrh.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '12px 16px',
              color: 'white',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.75rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>Mot de passe</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '12px 48px 12px 16px',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >{showPassword ? '🙈' : '👁'}</button>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          disabled={loading || !form.email || !form.password}
          style={{
            width: '100%',
            background: loading || !form.email || !form.password
              ? 'rgba(255,255,255,0.08)'
              : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: loading || !form.email || !form.password
              ? 'rgba(255,255,255,0.3)'
              : 'white',
            padding: '14px',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: '600',
            border: 'none',
            cursor: loading || !form.email || !form.password ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 0 15px rgba(59,130,246,0.15)'
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }}
              />
              Connexion...
            </span>
          ) : 'Se connecter →'}
        </motion.button>

        {/* Hint */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: 'rgba(59,130,246,0.05)',
          border: '1px solid rgba(59,130,246,0.1)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
            Demo: <span style={{ color: '#93c5fd' }}>hr@ats.com</span> / <span style={{ color: '#93c5fd' }}>1234</span>
          </p>
        </div>
      </motion.div>
    </main>
  )
}