import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, TrendingUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function LoginPage() {
    const { login, loginWithGoogle } = useAuth()
    const [form, setForm] = useState({ email: '', password: '' })
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
        if (!form.email.trim()) newErrors.email = 'Informe seu e-mail'
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'E-mail inválido'
        if (!form.password) newErrors.password = 'Informe sua senha'
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
            await login(form.email, form.password)
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

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-bg-orb orb-1" />
                <div className="auth-bg-orb orb-2" />
                <div className="auth-bg-orb orb-3" />
            </div>

            <div className="auth-container">
                {/* Painel Esquerdo — Branding */}
                <div className="auth-brand-panel">
                    <div className="auth-brand-content">
                        <div className="auth-logo">
                            <TrendingUp size={32} />
                        </div>
                        <h1 className="auth-brand-title">FluxoZen</h1>
                        <p className="auth-brand-tagline">
                            Equilíbrio financeiro na palma da sua mão.
                        </p>
                        <div className="auth-brand-stats">
                            <div className="brand-stat">
                                <span className="brand-stat-value">100%</span>
                                <span className="brand-stat-label">Seguro</span>
                            </div>
                            <div className="brand-stat-divider" />
                            <div className="brand-stat">
                                <span className="brand-stat-value">Real-time</span>
                                <span className="brand-stat-label">Atualização</span>
                            </div>
                            <div className="brand-stat-divider" />
                            <div className="brand-stat">
                                <span className="brand-stat-value">∞</span>
                                <span className="brand-stat-label">Transações</span>
                            </div>
                        </div>
                    </div>
                    <div className="auth-brand-illustration">
                        <div className="floaty-card card-a">
                            <span className="floaty-label">Saldo Total</span>
                            <span className="floaty-value positive">R$ 4.820,00</span>
                        </div>
                        <div className="floaty-card card-b">
                            <span className="floaty-label">Meta Viagem</span>
                            <div className="floaty-progress">
                                <div className="floaty-progress-bar" style={{ width: '68%' }} />
                            </div>
                            <span className="floaty-percent">68%</span>
                        </div>
                        <div className="floaty-card card-c">
                            <span className="floaty-label">Economia este mês</span>
                            <span className="floaty-value positive">↑ 12%</span>
                        </div>
                    </div>
                </div>

                {/* Painel Direito — Formulário */}
                <div className="auth-form-panel">
                    <div className="auth-form-card">
                        <div className="auth-form-header">
                            <h2 id="login-title" className="auth-form-title">Bem-vindo de volta</h2>
                            <p className="auth-form-subtitle">
                                Entre na sua conta para continuar
                            </p>
                        </div>

                        {globalError && (
                            <div className="auth-alert auth-alert-error" role="alert">
                                {globalError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="auth-form" aria-labelledby="login-title">
                            <Input
                                label="E-mail"
                                id="login-email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                icon={Mail}
                                value={form.email}
                                onChange={handleChange}
                                error={errors.email}
                                autoComplete="email"
                                autoFocus
                            />
                            <Input
                                label="Senha"
                                id="login-password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                icon={Lock}
                                value={form.password}
                                onChange={handleChange}
                                error={errors.password}
                                autoComplete="current-password"
                            />

                            <div className="auth-forgot">
                                <Link to="/recuperar-senha" className="auth-link">
                                    Esqueceu a senha?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={loading}
                                fullWidth
                                id="btn-login"
                            >
                                Entrar
                            </Button>

                            <div className="auth-divider">
                                <span>ou continue com</span>
                            </div>

                            <Button
                                type="button"
                                variant="google"
                                size="lg"
                                loading={googleLoading}
                                fullWidth
                                id="btn-google-login"
                                onClick={handleGoogle}
                            >
                                <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Entrar com Google
                            </Button>
                        </form>

                        <p className="auth-switch">
                            Não tem uma conta?{' '}
                            <Link to="/cadastro" className="auth-link auth-link-strong">
                                Criar conta grátis
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getFirebaseError(code) {
    const messages = {
        'auth/user-not-found': 'Nenhuma conta encontrada com este e-mail.',
        'auth/wrong-password': 'Senha incorreta. Tente novamente.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/user-disabled': 'Esta conta foi desativada.',
        'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
        'auth/invalid-credential': 'E-mail ou senha incorretos.',
        'auth/popup-closed-by-user': 'Login cancelado.',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    }
    return messages[code] || 'Ocorreu um erro. Tente novamente.'
}
