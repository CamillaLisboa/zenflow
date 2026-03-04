import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export default function HistoryChart({ history }) {
    if (!history) return null;

    const dates = Object.keys(history);
    const labels = dates.map(dateStr => {
        const [, month, day] = dateStr.split('-');
        return `${day}/${month}`;
    });

    const incomeData = dates.map(dateStr => history[dateStr].income);
    const expenseData = dates.map(dateStr => history[dateStr].expense);

    const data = {
        labels,
        datasets: [
            {
                label: 'Receitas',
                data: incomeData,
                backgroundColor: 'hsl(168, 60%, 45%)', // Brand primary green
                borderRadius: 4,
            },
            {
                label: 'Despesas',
                data: expenseData,
                backgroundColor: 'hsl(0, 55%, 45%)', // Error red
                borderRadius: 4,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'hsl(225, 12%, 65%)',
                    font: { family: "'Plus Jakarta Sans', 'Inter', sans-serif", size: 13 },
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'hsl(225, 16%, 15%)',
                titleColor: 'hsl(225, 20%, 95%)',
                bodyColor: 'hsl(225, 12%, 65%)',
                borderColor: 'hsl(225, 12%, 28%)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: 'hsl(225, 12%, 65%)' }
            },
            y: {
                grid: { color: 'hsl(225, 12%, 22%)' },
                ticks: {
                    color: 'hsl(225, 12%, 65%)',
                    callback: function (value) {
                        return 'R$ ' + value; // Customizada de forma resumida p/ eixos responsivos
                    }
                }
            }
        }
    };

    return (
        <div className="chart-card history-chart-card">
            <h3 className="section-title">Últimos 7 Dias</h3>
            <div className="history-chart-wrapper">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
