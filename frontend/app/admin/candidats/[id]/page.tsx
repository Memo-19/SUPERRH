'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, Brain, CheckCircle, XCircle, Star, 
  Mail, Phone, FileText, Check, X, Briefcase
} from 'lucide-react'

// ─── TYPES ───────────────────────────────────────────
interface CandidateData {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  job_titre: string;
  cv_url: string;
  status: string;
  match_score?: number;
  ai_analysis?: any; // تم جعلها مرنة لاستقبال أي صيغة من الباك أند
}

export default function AICandidateEvaluation() {
  const params = useParams()
  const [candidate, setCandidate] = useState<CandidateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // 1. جلب البيانات
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/candidates/${params.id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => { setCandidate(data); setLoading(false) })
      .catch(err => { console.error("Erreur API", err); setLoading(false) })
  }, [params.id])

  // 2. دالة تحديث الحالة
  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const res = await fetch(`http://127.0.0.1:8000/candidates/${params.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus })
      })
      if (res.ok) {
        setCandidate(prev => prev ? { ...prev, status: newStatus.toLowerCase() } : null)
      }
    } catch (error) {
      alert("Erreur de connexion au serveur.")
    } finally {
      setIsUpdating(false)
    }
  }

  // 3. العودة إلى الـ Dashboard
  const goBackToDashboard = () => {
    window.location.href = '/admin/dashboard'
  }

  // ─── مكون دائرة التقييم المطابق للـ Dashboard ───
  const CircularScore = ({ score }: { score: number }) => {
    const size = 110
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
          <span style={{ fontSize: size * 0.22, fontWeight: 800, color, letterSpacing: -1 }}>{score}%</span>
          <span style={{ fontSize: 9, color: '#71717a', letterSpacing: 1, fontFamily: 'monospace' }}>MATCH</span>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, border: '2px solid #2a2a2a', borderTop: '2px solid #10b981', borderRadius: '50%' }}
      />
    </div>
  )

  if (!candidate) return <div style={{ minHeight: '100vh', background: '#111111', color: '#f4f4f5', padding: '3rem', textAlign: 'center' }}>Candidat introuvable.</div>

  // 🛡️ درع الحماية الذكي: تجميع وتأمين البيانات قبل رسم الواجهة
  const ai = candidate.ai_analysis || {};
  const isAccepted = candidate.status === 'accepté';
  const isRejected = candidate.status === 'refusé';

  // معالجة الأرقام لتجنب أي خطأ NaN
  const finalScore = Math.round(ai.final_score || ai.score || candidate.match_score || 0);
  const baseScore = Math.round(ai.base_score || ai.keyword_score || finalScore || 0);
  const bonusScore = Math.round(ai.bonus || 0);

  // معالجة المصفوفات لتجنب خطأ ".map is not a function"
  const matchedSkills = ai.matched_skills || ai.strengths || ai.matched || [];
  const missingSkills = ai.missing_skills || ai.weaknesses || ai.missing || [];
  const bonusSkills = ai.bonus_skills || ai.extra_skills || [];

  return (
    <div style={{ minHeight: '100vh', background: '#111111', color: '#f4f4f5', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      
      {/* ─── TOP BAR ─── */}
      <div style={{ height: 60, background: '#111111', borderBottom: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 40 }}>
        
        <motion.button whileHover={{ background: 'rgba(255,255,255,0.06)' }} whileTap={{ scale: 0.98 }} onClick={goBackToDashboard}
          style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#a1a1aa', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.15s' }}>
          <ArrowLeft size={14} /> Retour au Dashboard
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ marginRight: 8, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: '1px solid',
              background: isAccepted ? 'rgba(16,185,129,0.1)' : isRejected ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)',
              borderColor: isAccepted ? 'rgba(16,185,129,0.2)' : isRejected ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)',
              color: isAccepted ? '#34d399' : isRejected ? '#f87171' : '#60a5fa'
          }}>
            {isAccepted ? 'Candidat Accepté' : isRejected ? 'Candidat Refusé' : 'Nouveau Candidat'}
          </div>

          <motion.button whileHover={{ opacity: isRejected ? 1 : 0.8 }} whileTap={{ scale: 0.97 }}
            onClick={() => handleStatusUpdate('refusé')} disabled={isUpdating || isRejected}
            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: (isUpdating || isRejected) ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
              background: isRejected ? 'rgba(239,68,68,0.15)' : 'transparent',
              border: `1px solid ${isRejected ? 'rgba(239,68,68,0.3)' : '#2a2a2a'}`,
              color: isRejected ? '#f87171' : '#a1a1aa',
              opacity: isUpdating ? 0.5 : 1
            }}>
            <X size={14} /> Refuser
          </motion.button>

          <motion.button whileHover={{ opacity: isAccepted ? 1 : 0.9 }} whileTap={{ scale: 0.97 }}
            onClick={() => handleStatusUpdate('accepté')} disabled={isUpdating || isAccepted}
            style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: (isUpdating || isAccepted) ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
              background: isAccepted ? 'rgba(16,185,129,0.15)' : '#ffffff',
              border: `1px solid ${isAccepted ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
              color: isAccepted ? '#10b981' : '#111111',
              opacity: isUpdating ? 0.5 : 1
            }}>
            <Check size={14} /> Accepter
          </motion.button>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ flex: 1, padding: '24px', display: 'grid', gridTemplateColumns: 'minmax(320px, 360px) 1fr', gap: '20px', alignItems: 'start', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        
        {/* ════ LEFT COLUMN ════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#2a2a2a', border: '1px solid #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: '#f4f4f5', margin: '0 auto 16px' }}>
             {(candidate.nom || 'C').charAt(0)}
            </div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', marginBottom: 4 }}>{candidate.nom}</h1>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#a1a1aa', fontSize: 12, marginBottom: 20 }}>
              <Briefcase size={12} /> {candidate.job_titre || 'Candidat'}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#111111', borderRadius: 8, padding: '12px', border: '1px solid #1f1f1f', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a1a1aa', fontSize: 12 }}><Mail size={14} /> {candidate.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a1a1aa', fontSize: 12 }}><Phone size={14} /> {candidate.telephone}</div>
            </div>
          </motion.div>

          {/* AI Score Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Brain size={16} color="#10b981" />
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5' }}>Analyse Intelligence Artificielle</h2>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <CircularScore score={finalScore} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, paddingLeft: 24 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#71717a', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, fontWeight: 600 }}>Score de Base</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5' }}>{baseScore}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#71717a', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, fontWeight: 600 }}>Bonus de Compétences</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: 4 }}>
                    +{bonusScore}% <Star size={12} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Skills Details */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, padding: '24px' }}>
            
            {/* Validées */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#34d399', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} /> Points Forts / Validés</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {matchedSkills.length > 0 ? matchedSkills.map((s: string, i: number) => (<span key={i} style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#34d399', padding: '4px 10px', borderRadius: 6, fontSize: 12 }}>{s}</span>)) : <span style={{ color: '#52525b', fontSize: 12 }}>Aucune donnée</span>}
              </div>
            </div>

            {/* Manquantes */}
            <div style={{ marginBottom: bonusSkills.length > 0 ? 20 : 0 }}>
              <div style={{ fontSize: 11, color: '#f87171', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><XCircle size={14} /> Points Faibles / Manquantes</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {missingSkills.length > 0 ? missingSkills.map((s: string, i: number) => (<span key={i} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5', padding: '4px 10px', borderRadius: 6, fontSize: 12 }}>{s}</span>)) : <span style={{ color: '#52525b', fontSize: 12 }}>Aucune donnée</span>}
              </div>
            </div>

            {/* Bonus */}
            {bonusSkills.length > 0 && (
              <div style={{ paddingTop: 20, borderTop: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Star size={14} /> Atouts Supplémentaires</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {bonusSkills.map((s: string, i: number) => (<span key={i} style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', color: '#c084fc', padding: '4px 10px', borderRadius: 6, fontSize: 12 }}>{s}</span>))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ════ RIGHT COLUMN: PDF VIEWER ════ */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ height: 'calc(100vh - 110px)', background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111111' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} color="#a1a1aa" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5' }}>Document Original (CV)</span>
            </div>
            <a href={candidate.cv_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#2a2a2a', color: '#f4f4f5', padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #3f3f46', transition: 'background 0.2s' }}>
               Ouvrir PDF Externe
            </a>
          </div>

          <div style={{ flex: 1, backgroundColor: '#09090b' }}>
             <iframe 
                src={`${candidate.cv_url}#toolbar=0&navpanes=0&scrollbar=0`} 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
                title="CV Document"
             />
          </div>
        </motion.div>
      </div>
    </div>
  )
}