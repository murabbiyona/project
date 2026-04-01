import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import {
  Mail,
  Lock,
  Phone,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Sparkles,
  ChevronLeft,
} from 'lucide-react'

type AuthMode = 'login' | 'register' | 'phone' | 'otp'

function getLocalizedError(message: string): string {
  if (message === 'Failed to fetch') return "Serverga ulanib bo'lmadi. Internet aloqangizni tekshiring."
  if (message.includes('Invalid login credentials')) return "Email yoki parol noto'g'ri."
  if (message.includes('Email not confirmed')) return "Email tasdiqlanmagan. Pochtangizni tekshiring."
  if (message.includes('User already registered')) return "Bu email allaqachon ro'yxatdan o'tgan."
  if (message.includes('email rate limit exceeded')) return "Juda ko'p urinish. Biroz kutib, qaytadan urinib ko'ring."
  if (message.includes('Database error')) return "Server xatoligi. Qaytadan urinib ko'ring."
  if (message.includes('Password should be at least')) return "Parol kamida 6 ta belgidan iborat bo'lishi kerak."
  if (message.includes('invalid')) return "Kiritilgan ma'lumotlar noto'g'ri. Tekshirib, qaytadan urinib ko'ring."
  return message
}

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithPhone, verifyOtp } = useAuth()

  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'register') {
        const { error: err } = await signUpWithEmail(email, password, fullName)
        if (err) {
          setError(getLocalizedError(err.message))
        } else {
          setMode('login')
          setError('')
        }
      } else {
        const { error: err } = await signInWithEmail(email, password)
        if (err) {
          setError(getLocalizedError(err.message))
        } else {
          navigate('/')
        }
      }
    } catch {
      setError("Kutilmagan xatolik yuz berdi. Qaytadan urinib ko'ring.")
    }
    setLoading(false)
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'phone') {
      const { error: err } = await signInWithPhone(phone)
      if (err) {
        setError(err.message)
      } else {
        setMode('otp')
      }
    } else if (mode === 'otp') {
      const { error: err } = await verifyOtp(phone, otpCode)
      if (err) {
        setError(err.message)
      } else {
        navigate('/')
      }
    }
    setLoading(false)
  }

  async function handleGoogleSignIn() {
    setLoading(true)
    const { error: err } = await signInWithGoogle()
    if (err) setError(err.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Murabbiyona</h1>
          <p className="text-white/50 mt-1 text-sm flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Ta'lim Platformasi
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          className="backdrop-blur-xl bg-white/[0.07] border border-white/[0.12] rounded-3xl p-8 shadow-2xl shadow-black/20"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {/* Email Login / Register */}
            {(mode === 'login' || mode === 'register') && (
              <motion.div
                key="email-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-white mb-6">
                  {mode === 'login' ? t('auth.login', 'Kirish') : t('auth.register', "Ro'yxatdan o'tish")}
                </h2>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {mode === 'register' && (
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                      <input
                        type="text"
                        placeholder={t('auth.fullName', "To'liq ism")}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.08] transition-all duration-300"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                    <input
                      type="email"
                      placeholder={t('auth.email', 'Email manzil')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.08] transition-all duration-300"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.password', 'Parol')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-11 pr-11 py-3.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.08] transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400/90 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? t('auth.loginBtn', 'Kirish') : t('auth.registerBtn', "Ro'yxatdan o'tish")}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/30 text-xs uppercase tracking-wider">{t('auth.or', 'yoki')}</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Social & Phone buttons */}
                <div className="space-y-3">
                  <motion.button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl text-white/80 font-medium flex items-center justify-center gap-3 transition-all duration-300"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google {t('auth.withGoogle', 'bilan kirish')}
                  </motion.button>

                  <motion.button
                    onClick={() => { setMode('phone'); setError('') }}
                    className="w-full py-3 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl text-white/80 font-medium flex items-center justify-center gap-3 transition-all duration-300"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Phone className="w-5 h-5 text-emerald-400" />
                    {t('auth.withPhone', 'Telefon raqam bilan kirish')}
                  </motion.button>
                </div>

                {/* Toggle login/register */}
                <p className="text-center mt-5 text-white/40 text-sm">
                  {mode === 'login' ? (
                    <>
                      {t('auth.noAccount', "Hisobingiz yo'qmi?")}{' '}
                      <button onClick={() => { setMode('register'); setError('') }} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        {t('auth.registerLink', "Ro'yxatdan o'ting")}
                      </button>
                    </>
                  ) : (
                    <>
                      {t('auth.hasAccount', 'Hisobingiz bormi?')}{' '}
                      <button onClick={() => { setMode('login'); setError('') }} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        {t('auth.loginLink', 'Kiring')}
                      </button>
                    </>
                  )}
                </p>
              </motion.div>
            )}

            {/* Phone / OTP */}
            {(mode === 'phone' || mode === 'otp') && (
              <motion.div
                key="phone-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => { setMode('login'); setError('') }}
                  className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm mb-4 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('auth.back', 'Orqaga')}
                </button>

                <h2 className="text-xl font-semibold text-white mb-2">
                  {mode === 'phone' ? t('auth.phoneLogin', 'Telefon bilan kirish') : t('auth.enterOtp', 'Kodni kiriting')}
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  {mode === 'phone'
                    ? t('auth.phoneHint', "Telefon raqamingizga SMS kod yuboriladi")
                    : t('auth.otpHint', `${phone} raqamiga yuborilgan kodni kiriting`)}
                </p>

                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  {mode === 'phone' ? (
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                      <input
                        type="tel"
                        placeholder="+998 90 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.08] transition-all duration-300"
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          value={otpCode[i] || ''}
                          onChange={(e) => {
                            const val = e.target.value
                            if (/^\d*$/.test(val)) {
                              const newOtp = otpCode.split('')
                              newOtp[i] = val
                              setOtpCode(newOtp.join(''))
                              if (val && i < 5) {
                                const next = e.target.nextElementSibling as HTMLInputElement
                                next?.focus()
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !otpCode[i] && i > 0) {
                              const prev = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                              prev?.focus()
                            }
                          }}
                          className="w-12 h-14 text-center text-xl font-bold bg-white/[0.06] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.08] transition-all duration-300"
                        />
                      ))}
                    </div>
                  )}

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400/90 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === 'phone' ? t('auth.sendCode', 'Kod yuborish') : t('auth.verify', 'Tasdiqlash')}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center mt-6 text-white/20 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          &copy; 2026 Murabbiyona. {t('auth.rights', 'Barcha huquqlar himoyalangan.')}
        </motion.p>
      </div>
    </div>
  )
}
