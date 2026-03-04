import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { CheckCircle, AlertCircle } from 'lucide-react'

/*
 * Schema do Firestore para a coleção "transactions":
 * {
 *   userId: string (ID do usuário logado)
 *   description: string
 *   amount: number 
 *   type: 'income' | 'expense'
 *   category: string
 *   date: string (YYYY-MM-DD)
 *   createdAt: timestamp (serverTimestamp)
 * }
 */

export default function TransactionForm({ onSuccess }) {
    const { currentUser } = useAuth()
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            amount: '',
            date: new Date().toISOString().split('T')[0],
            type: 'expense'
        }
    })
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleSave = async (data) => {
        if (!currentUser) {
            setErrorMsg('Usuário não autenticado.')
            return
        }

        setLoading(true)
        setErrorMsg('')
        setSuccessMsg('')

        try {
            const transactionData = {
                userId: currentUser.uid,
                description: data.description,
                amount: parseFloat(data.amount),
                type: data.type,
                category: data.category,
                date: data.date,
                createdAt: serverTimestamp()
            }

            await addDoc(collection(db, 'transactions'), transactionData)

            setSuccessMsg('Transação salva com sucesso!')
            reset()
            if (onSuccess) onSuccess()

            // Auto hide success message
            setTimeout(() => setSuccessMsg(''), 3000)

        } catch (error) {
            console.error('Erro ao salvar transação:', error)
            setErrorMsg('Ocorreu um erro ao salvar a transação.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="transaction-form-container">
            <h3 className="section-title">Nova Transação</h3>

            {successMsg && (
                <div className="alert alert-success">
                    <CheckCircle size={18} />
                    {successMsg}
                </div>
            )}

            {errorMsg && (
                <div className="alert alert-error">
                    <AlertCircle size={18} />
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit(handleSave)} className="transaction-form">
                <div className="form-row">
                    <Input
                        label="Descrição"
                        id="description"
                        placeholder="Ex: Supermercado, Salário"
                        {...register('description', { required: 'A descrição é obrigatória' })}
                        error={errors.description?.message}
                    />

                    <Input
                        label="Valor (R$)"
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register('amount', {
                            required: 'O valor é obrigatório',
                            min: { value: 0.01, message: 'O valor deve ser maior que zero' }
                        })}
                        error={errors.amount?.message}
                    />
                </div>

                <div className="form-row">
                    <div className="input-wrapper flex-1">
                        <label className="input-label">Tipo</label>
                        <div className="radio-group">
                            <label className="radio-label income">
                                <input
                                    type="radio"
                                    value="income"
                                    {...register('type')}
                                    className="radio-input"
                                />
                                <span className="radio-text">Receita</span>
                            </label>
                            <label className="radio-label expense">
                                <input
                                    type="radio"
                                    value="expense"
                                    {...register('type')}
                                    className="radio-input"
                                />
                                <span className="radio-text">Despesa</span>
                            </label>
                        </div>
                    </div>

                    <div className="input-wrapper flex-1">
                        <label htmlFor="category" className="input-label">Categoria</label>
                        <div className={`input-field-container ${errors.category ? 'input-error' : ''}`}>
                            <select
                                id="category"
                                className="input-field select-field"
                                {...register('category', { required: 'A categoria é obrigatória' })}
                            >
                                <option value="">Selecione...</option>
                                <option value="alimentacao">Alimentação</option>
                                <option value="moradia">Moradia</option>
                                <option value="transporte">Transporte</option>
                                <option value="saude">Saúde</option>
                                <option value="lazer">Lazer</option>
                                <option value="salario">Salário</option>
                                <option value="outros">Outros</option>
                            </select>
                        </div>
                        {errors.category && (
                            <span className="input-error-msg" id="category-error" role="alert">
                                <AlertCircle size={14} />
                                {errors.category.message}
                            </span>
                        )}
                    </div>
                </div>

                <div className="form-row date-row">
                    <Input
                        label="Data"
                        id="date"
                        type="date"
                        {...register('date', { required: 'A data é obrigatória' })}
                        error={errors.date?.message}
                    />
                </div>

                <div className="form-actions">
                    <Button type="submit" variant="primary" loading={loading} id="btn-save-transaction">
                        Salvar Transação
                    </Button>
                </div>
            </form>
        </div>
    )
}
