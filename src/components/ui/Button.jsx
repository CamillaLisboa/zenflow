import { Loader2 } from 'lucide-react'

/**
 * Button reutilizável com variantes, tamanhos e estado de loading
 *
 * Props:
 * - variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'google'
 * - size: 'sm' | 'md' | 'lg'
 * - loading: boolean — exibe spinner e desabilita o botão
 * - icon: ReactNode — ícone no lado esquerdo
 * - iconRight: ReactNode — ícone no lado direito
 * - fullWidth: boolean — ocupa 100% da largura
 * - children: ReactNode
 */
export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    iconRight: IconRight,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
}) {
    const isDisabled = disabled || loading

    return (
        <button
            className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
            disabled={isDisabled}
            aria-busy={loading}
            {...props}
        >
            {loading ? (
                <Loader2 size={18} className="btn-spinner" />
            ) : Icon ? (
                <Icon size={18} className="btn-icon-left" />
            ) : null}
            {children && <span className="btn-label">{children}</span>}
            {!loading && IconRight && <IconRight size={18} className="btn-icon-right" />}
        </button>
    )
}
