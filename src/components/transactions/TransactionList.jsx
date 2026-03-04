import { useTransactions } from '../../hooks/useTransactions'
import TransactionCard from './TransactionCard'
import { Loader2 } from 'lucide-react'

export default function TransactionList() {
    const { transactions, loading, error } = useTransactions()

    if (loading) {
        return (
            <div className="transactions-loading">
                <Loader2 size={24} className="loading-spinner" />
                <p>Carregando transações...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="transactions-error">
                <p>Erro ao carregar transações. Tente novamente.</p>
            </div>
        )
    }

    if (transactions.length === 0) {
        return (
            <div className="transactions-empty">
                <p>Nenhuma transação encontrada.</p>
            </div>
        )
    }

    return (
        <div className="transactions-list">
            <h3 className="section-title">Últimas Transações</h3>
            <div className="transactions-grid">
                {transactions.map(t => (
                    <TransactionCard key={t.id} transaction={t} />
                ))}
            </div>
        </div>
    )
}
