import { Trash2 } from 'lucide-react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function TransactionCard({ transaction }) {
    const isIncome = transaction.type === 'income'

    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
            try {
                await deleteDoc(doc(db, 'transactions', transaction.id))
            } catch (error) {
                console.error('Erro ao deletar transação:', error)
                alert('Erro ao excluir transação.')
            }
        }
    }

    const formattedDate = formatDate(transaction.date)
    const formattedAmount = formatCurrency(transaction.amount)

    return (
        <div className="transaction-card">
            <div className="tc-info">
                <h4 className="tc-title">{transaction.description}</h4>
                <div className="tc-details">
                    <span className="tc-category">{transaction.category}</span>
                    <span className="tc-bullet">•</span>
                    <span className="tc-date">{formattedDate}</span>
                </div>
            </div>

            <div className="tc-actions">
                <span className={`tc-amount ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? '+' : '-'} {formattedAmount}
                </span>
                <button className="btn-delete" onClick={handleDelete} aria-label="Excluir" title="Excluir Transação">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    )
}
