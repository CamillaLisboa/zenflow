import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

export default function SummaryCards({ totals }) {
    if (!totals) totals = { incomes: 0, expenses: 0, balance: 0 }

    const isPositive = totals.balance >= 0

    return (
        <div className="summary-cards-container">
            <div className="summary-card">
                <div className="summary-header">
                    <span className="summary-title">Receitas</span>
                    <ArrowUpCircle size={24} className="icon-income" />
                </div>
                <div className="summary-amount income">
                    {formatCurrency(totals.incomes)}
                </div>
            </div>

            <div className="summary-card">
                <div className="summary-header">
                    <span className="summary-title">Despesas</span>
                    <ArrowDownCircle size={24} className="icon-expense" />
                </div>
                <div className="summary-amount expense">
                    {formatCurrency(totals.expenses)}
                </div>
            </div>

            <div className={`summary-card ${isPositive ? 'card-positive' : 'card-negative'}`}>
                <div className="summary-header">
                    <span className="summary-title text-white">Saldo Total</span>
                    <DollarSign size={24} className="text-white opacity-80" />
                </div>
                <div className="summary-amount text-white">
                    {formatCurrency(totals.balance)}
                </div>
            </div>
        </div>
    )
}
