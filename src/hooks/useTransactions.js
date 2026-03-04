import { useState, useEffect, useMemo } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './useAuth'

export function useTransactions() {
    const { currentUser } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!currentUser) {
            setTransactions([])
            setLoading(false)
            return
        }

        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', currentUser.uid)
        )

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const results = []
                querySnapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() })
                })

                // Ordenação manual para evitar exigência de composite index no Firestore
                results.sort((a, b) => {
                    if (b.date !== a.date) return b.date.localeCompare(a.date)
                    const timeA = a.createdAt?.toMillis() || 0
                    const timeB = b.createdAt?.toMillis() || 0
                    return timeB - timeA
                })

                setTransactions(results)
                setLoading(false)
            },
            (err) => {
                console.error('Erro ao buscar transações:', err)
                setError(err.message)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [currentUser])

    const totals = useMemo(() => {
        // Inicializa o objeto do histórico para os últimos 7 dias na visão local
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const historyData = {}

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today)
            d.setDate(d.getDate() - i)
            const dateStr = [
                d.getFullYear(),
                String(d.getMonth() + 1).padStart(2, '0'),
                String(d.getDate()).padStart(2, '0')
            ].join('-')

            historyData[dateStr] = { income: 0, expense: 0 }
        }

        return transactions.reduce(
            (acc, transaction) => {
                if (transaction.type === 'income') {
                    acc.incomes += transaction.amount
                } else if (transaction.type === 'expense') {
                    acc.expenses += transaction.amount

                    if (!acc.expensesByCategory[transaction.category]) {
                        acc.expensesByCategory[transaction.category] = 0
                    }
                    acc.expensesByCategory[transaction.category] += transaction.amount
                }

                // Popula o gráfico do histórico caso a data caia nos últimos 7 dias
                if (acc.history[transaction.date] !== undefined) {
                    if (transaction.type === 'income') {
                        acc.history[transaction.date].income += transaction.amount
                    } else if (transaction.type === 'expense') {
                        acc.history[transaction.date].expense += transaction.amount
                    }
                }

                acc.balance = acc.incomes - acc.expenses
                return acc
            },
            { incomes: 0, expenses: 0, balance: 0, expensesByCategory: {}, history: historyData }
        )
    }, [transactions])

    return { transactions, loading, error, totals }
}
