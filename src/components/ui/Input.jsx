import { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

/**
 * Input reutilizável com suporte a ícones, senha visível/oculta e estados de erro
 *
 * Props:
 * - label: string — rótulo do campo
 * - id: string — id único do input
 * - type: string — tipo do input (text, email, password, etc.)
 * - error: string — mensagem de erro
 * - icon: ReactNode — ícone no lado esquerdo
 * - hint: string — texto de dica abaixo do campo
 * - className: string — classes extras
 */
const Input = forwardRef(function Input(
    {
        label,
        id,
        type = 'text',
        error,
        icon: Icon,
        hint,
        className = '',
        ...props
    },
    ref
) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={id} className="input-label">
                    {label}
                </label>
            )}
            <div className={`input-field-container ${error ? 'input-error' : ''}`}>
                {Icon && (
                    <span className="input-icon-left">
                        <Icon size={18} />
                    </span>
                )}
                <input
                    ref={ref}
                    id={id}
                    type={inputType}
                    className={`input-field ${Icon ? 'has-icon-left' : ''} ${isPassword ? 'has-icon-right' : ''}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="input-icon-right password-toggle"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <span id={`${id}-error`} className="input-error-msg" role="alert">
                    <AlertCircle size={14} />
                    {error}
                </span>
            )}
            {hint && !error && (
                <span id={`${id}-hint`} className="input-hint">
                    {hint}
                </span>
            )}
        </div>
    )
})

export default Input
