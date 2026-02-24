import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, TrendingUp, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const BENEFITS = [
    'Dashboard visual com gráficos dinâmicos',
    'Controle de receitas e despesas em tempo real',
    'Metas de poupança com barra de progresso',
    'Alertas de vencimento e pendências',
    'Sugestões inteligentes de economia',
    'Exportação em CSV e PDF',
]

export default function RegisterPage() {
    const { register, loginWithGoogle } = useAuth()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [globalError, setGlobalError] = useState('')

    function handleChange(e) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
        if (globalError) setGlobalError('')
    }

    function validate() {
        const newErrors = {}
        if (!form.name.trim() || form.name.trim().length < 2)
            newErrors.name = 'Nome deve ter ao menos 2 caracteres'
        if (!form.email.trim()) newErrors.email = 'Informe seu e-mail'
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'E-mail inválido'
        if (!form.password) newErrors.password = 'Informe uma senha'
        else if (form.password.length < 6) newErrors.password = 'Senha deve ter ao menos 6 caracteres'
        if (!form.confirmPassword) newErrors.confirmPassword = 'Confirme sua senha'
        else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem'
        return newErrors
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        setLoading(true)
        setGlobalError('')
        try {
            await register(form.email, form.password, form.name.trim())
        } catch (err) {
            setGlobalError(getFirebaseError(err.code))
        } finally {
            setLoading(false)
        }
    }

    async function handleGoogle() {
        setGoogleLoading(true)
        setGlobalError('')
        try {
            await loginWithGoogle()
        } catch (err) {
            setGlobalError(getFirebaseError(err.code))
        } finally {
            setGoogleLoading(false)
        }
    }

    const passwordStrength = getPasswordStrength(form.password)

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-bg-orb orb-1" />
                <div className="auth-bg-orb orb-2" />
                <div className="auth-bg-orb orb-3" />
            </div>

            <div className="auth-container auth-container-register">
                {/* Painel Esquerdo — Benefícios */}
                <div className="auth-brand-panel">
                    <div className="auth-brand-content">
                        <div className="auth-logo">
                            <TrendingUp size={32} />
                        </div>
                        <h1 className="auth-brand-title">FluxoZen</h1>
                        <p className="auth-brand-tagline">
                            Tudo que você precisa para dominar suas finanças.
                        </p>
                        <ul className="auth-benefits-list">
                            {BENEFITS.map((benefit) => (
                                <li key={benefit} className="auth-benefit-item">
                                    <CheckCircle size={16} className="benefit-icon" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Painel Direito — Formulário */}
                <div className="auth-form-panel">
                    <div className="auth-form-card">
                        <div className="auth-form-header">
                            <h2 id="register-title" className="auth-form-title">Criar conta grátis</h2>
                            <p className="auth-form-subtitle">
                                Comece sua jornada de equilíbrio financeiro
                            </p>
                        </div>

                        {globalError && (
                            <div className="auth-alert auth-alert-error" role="alert">
                                {globalError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="auth-form" aria-labelledby="register-title">
                            <Input
                                label="Nome completo"
                                id="register-name"
                                name="name"
                                type="text"
                                placeholder="Seu nome"
                                icon={User}
                                value={form.name}
                                onChange={handleChange}
                                error={errors.name}
                                autoComplete="name"
                                autoFocus
                            />
                            <Input
                                label="E-mail"
                                id="register-email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                icon={Mail}
                                value={form.email}
                                onChange={handleChange}
                                error={errors.email}
                                autoComplete="email"
                            />
                            <div className="input-wrapper">
                                <Input
                                    label="Senha"
                                    id="register-password"
                                    name="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    icon={Lock}
                                    value={form.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    autoComplete="new-password"
                                />
                                {form.password && (
                                    <div className="password-strength">
                                        <div className="strength-bars">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`strength-bar ${passwordStrength.score >= level ? `strength-${passwordStrength.label}` : ''}`}
                                                />
                                            ))}
                                        </div>
                                        <span className={`strength-text strength-text-${passwordStrength.label}`}>
                                            {passwordStrength.text}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <Input
                                label="Confirmar senha"
                                id="register-confirm-password"
                                name="confirmPassword"
                                type="password"
                                placeholder="Repita a senha"
                                icon={Lock}
                                value={form.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                autoComplete="new-password"
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={loading}
                                fullWidth
                                id="btn-register"
                            >
                                Criar minha conta
                            </Button>

                            <div className="auth-divider">
                                <span>ou cadastre com</span>
                            </div>

                            <Button
                                type="button"
                                variant="google"
                                size="lg"
                                loading={googleLoading}
                                fullWidth
                                id="btn-google-register"
                                onClick={handleGoogle}
                            >
                                <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continuar com Google
                            </Button>
                        </form>

                        <p className="auth-switch">
                            Já tem conta?{' '}
                            <Link to="/login" className="auth-link auth-link-strong">
                                Fazer login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getPasswordStrength(password) {
    if (!password) return { score: 0, label: 'weak', text: '' }
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 1) return { score: 1, label: 'weak', text: 'Fraca' }
    if (score === 2) return { score: 2, label: 'fair', text: 'Razoável' }
    if (score === 3) return { score: 3, label: 'good', text: 'Boa' }
    return { score: 4, label: 'strong', text: 'Forte' }
}

function getFirebaseError(code) {
    const messages = {
        'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/weak-password': 'Senha muito fraca. Use ao menos 6 caracteres.',
        'auth/operation-not-allowed': 'Cadastro com e-mail não está habilitado.',
        'auth/popup-closed-by-user': 'Cadastro cancelado.',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    }
    return messages[code] || 'Ocorreu um erro. Tente novamente.'
}
