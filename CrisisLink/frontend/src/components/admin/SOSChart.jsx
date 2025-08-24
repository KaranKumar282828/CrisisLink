import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function SOSByTypeChart({ data }) {
  const chartData = {
    labels: data?.map(item => item._id) || [],
    datasets: [
      {
        data: data?.map(item => item.count) || [],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">SOS Requests by Type</h3>
      <Doughnut data={chartData} />
    </div>
  );
}

export function ResponseTimeChart({ responseTime }) {
  const data = {
    labels: ['Average', 'Minimum', 'Maximum'],
    datasets: [
      {
        label: 'Response Time (minutes)',
        data: [
          responseTime.avgResponseTime ? Math.round(responseTime.avgResponseTime / 60000) : 0,
          responseTime.minResponseTime ? Math.round(responseTime.minResponseTime / 60000) : 0,
          responseTime.maxResponseTime ? Math.round(responseTime.maxResponseTime / 60000) : 0,
        ],
        backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Response Time Analysis</h3>
      <Bar data={data} />
    </div>
  );
}