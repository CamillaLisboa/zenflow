import { useAuth } from '../hooks/useAuth'
import { TrendingUp, LogOut } from 'lucide-react'
import Button from '../components/ui/Button'
import TransactionForm from '../components/transactions/TransactionForm'
import TransactionList from '../components/transactions/TransactionList'
import SummaryCards from '../components/dashboard/SummaryCards'
import { useTransactions } from '../hooks/useTransactions'

export default function DashboardPage() {
    const { currentUser, userProfile, logout } = useAuth()
    const { totals } = useTransactions()
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
            <main className="dashboard-main dashboard-layout">
                <SummaryCards totals={totals} />
                <div className="dashboard-content dashboard-grid">
                    <div className="dashboard-left-col">
                        <TransactionForm />
                    </div>
                    <div className="dashboard-right-col">
                        <TransactionList />
                    </div>
                </div>
            </main>
        </div>
    )
}
