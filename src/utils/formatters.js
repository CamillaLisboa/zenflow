export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

export const formatDate = (dateString) => {
    // Adiciona o horário para evitar problemas de fuso horário caso venha apenas YYYY-MM-DD
    const date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`)
    return new Intl.DateTimeFormat('pt-BR').format(date)
}
