import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, TrendingUp, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [globalError, setGlobalError] = useState('')

    function validate() {
        if (!email.trim()) return 'Informe seu e-mail'
        if (!/\S+@\S+\.\S+/.test(email)) return 'E-mail inválido'
        return ''
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const error = validate()
        if (error) {
            setEmailError(error)
            return
        }

        setLoading(true)
        setGlobalError('')
        setEmailError('')

        try {
            await resetPassword(email)
            setSuccess(true)
        } catch (err) {
            setGlobalError(getFirebaseError(err.code))
        } finally {
            setLoading(false)
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
                            Recupere o acesso à sua conta em segundos.
                        </p>
                        <div className="auth-brand-stats">
                            <div className="brand-stat">
                                <span className="brand-stat-value">100%</span>
                                <span className="brand-stat-label">Seguro</span>
                            </div>
                            <div className="brand-stat-divider" />
                            <div className="brand-stat">
                                <span className="brand-stat-value">Rápido</span>
                                <span className="brand-stat-label">Recuperação</span>
                            </div>
                            <div className="brand-stat-divider" />
                            <div className="brand-stat">
                                <span className="brand-stat-value">Fácil</span>
                                <span className="brand-stat-label">Processo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Painel Direito — Formulário */}
                <div className="auth-form-panel">
                    <div className="auth-form-card">

                        {success ? (
                            /* Estado de sucesso */
                            <div className="forgot-success">
                                <div className="forgot-success-icon">
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="auth-form-title">E-mail enviado!</h2>
                                <p className="auth-form-subtitle">
                                    Enviamos um link de recuperação para{' '}
                                    <strong>{email}</strong>. Verifique sua caixa de entrada
                                    e a pasta de spam.
                                </p>
                                <div className="forgot-success-actions">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        id="btn-back-to-login"
                                        onClick={() => setSuccess(false)}
                                    >
                                        Reenviar e-mail
                                    </Button>
                                    <Link to="/login" className="auth-link auth-link-block">
                                        <ArrowLeft size={16} />
                                        Voltar para o login
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            /* Estado do formulário */
                            <>
                                <div className="auth-form-header">
                                    <h2 id="forgot-title" className="auth-form-title">
                                        Recuperar senha
                                    </h2>
                                    <p className="auth-form-subtitle">
                                        Informe seu e-mail e enviaremos um link para criar
                                        uma nova senha.
                                    </p>
                                </div>

                                {globalError && (
                                    <div className="auth-alert auth-alert-error" role="alert">
                                        {globalError}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    noValidate
                                    className="auth-form"
                                    aria-labelledby="forgot-title"
                                >
                                    <Input
                                        label="E-mail cadastrado"
                                        id="forgot-email"
                                        name="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        icon={Mail}
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            if (emailError) setEmailError('')
                                            if (globalError) setGlobalError('')
                                        }}
                                        error={emailError}
                                        autoComplete="email"
                                        autoFocus
                                    />

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        loading={loading}
                                        fullWidth
                                        id="btn-send-reset"
                                    >
                                        Enviar link de recuperação
                                    </Button>
                                </form>

                                <p className="auth-switch">
                                    Lembrou a senha?{' '}
                                    <Link to="/login" className="auth-link auth-link-strong">
                                        Voltar para o login
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function getFirebaseError(code) {
    const messages = {
        'auth/user-not-found': 'Nenhuma conta encontrada com este e-mail.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    }
    return messages[code] || 'Ocorreu um erro. Tente novamente.'
}
