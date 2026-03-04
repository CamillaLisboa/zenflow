import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function CategoryChart({ expensesByCategory }) {
    if (!expensesByCategory || Object.keys(expensesByCategory).length === 0) {
        return (
            <div className="chart-card empty-chart-card">
                <h3 className="section-title">Despesas por Categoria</h3>
                <div className="empty-chart-msg">
                    <p>Nenhuma despesa para exibir no gráfico.</p>
                </div>
            </div>
        )
    }

    const labels = Object.keys(expensesByCategory).map(cat =>
        cat.charAt(0).toUpperCase() + cat.slice(1)
    )
    const dataValues = Object.values(expensesByCategory)

    // Vibrant modern colors from the requested aesthetic
    const backgroundColors = [
        'hsl(340, 70%, 55%)', // Pink/Red
        'hsl(290, 70%, 55%)', // Purple
        'hsl(42, 95%, 55%)',  // Amber/Yellow
        'hsl(168, 60%, 45%)', // Teal/Green
        'hsl(210, 80%, 55%)', // Blue
        'hsl(20, 85%, 55%)',  // Orange
        'hsl(240, 60%, 65%)', // Indigo
    ]

    const data = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: backgroundColors.slice(0, labels.length),
                // Makes the border blend smoothly with the background
                borderWidth: 3,
                borderColor: 'hsl(225, 14%, 17%)', // matches --bg-card
                hoverOffset: 6,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: 'hsl(225, 12%, 65%)', // --text-secondary
                    padding: 20,
                    font: {
                        family: "'Plus Jakarta Sans', 'Inter', sans-serif",
                        size: 13
                    },
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'hsl(225, 16%, 15%)', // --bg-elevated
                titleColor: 'hsl(225, 20%, 95%)', // --text-primary
                bodyColor: 'hsl(225, 12%, 65%)', // --text-secondary
                padding: 12,
                cornerRadius: 8,
                borderColor: 'hsl(225, 12%, 28%)', // --border-default
                borderWidth: 1,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
        cutout: '72%', // makes it a thicker/thinner ring
    }

    return (
        <div className="chart-card">
            <h3 className="section-title">Despesas por Categoria</h3>
            <div className="chart-wrapper">
                <Doughnut data={data} options={options} />
            </div>
        </div>
    )
}
