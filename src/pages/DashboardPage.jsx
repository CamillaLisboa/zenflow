import { useAuth } from '../hooks/useAuth'
import { TrendingUp, LogOut, LayoutDashboard } from 'lucide-react'
import Button from '../components/ui/Button'

export default function DashboardPage() {
    const { currentUser, userProfile, logout } = useAuth()
    const displayName = userProfile?.displayName || currentUser?.displayName || 'Usuário'

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div className="dashboard-logo">
                    <TrendingUp size={24} />
                    <span>FluxoZen</span>
                </div>
                <div className="dashboard-user">
                    <span className="dashboard-greeting">Olá, {displayName.split(' ')[0]} 👋</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={LogOut}
                        onClick={logout}
                        id="btn-logout"
                    >
                        Sair
                    </Button>
                </div>
            </header>
            <main className="dashboard-main">
                <div className="dashboard-coming-soon">
                    <LayoutDashboard size={64} className="coming-soon-icon" />
                    <h2>Dashboard em construção</h2>
                    <p>Em breve você terá acesso a gráficos, transações, metas e muito mais!</p>
                </div>
            </main>
        </div>
    )
}
