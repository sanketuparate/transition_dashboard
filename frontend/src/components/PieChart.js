
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for the Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);


const PieChart = ({ data }) => {
  if (!data.labels || !data.labels.length) {
      return <p>No data available for the selected month.</p>;
  }

  const pieChartData = {
      labels: data.labels,
      datasets: [
          {
              label: 'Categories',
              data: data.values,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
      ],
  };

  const options = {
      maintainAspectRatio: false, // Allow custom size
  };

  return (
      <div style={{ width: '600px', height: '600px', margin: '0 auto' }}>
          <Pie data={pieChartData} options={options} />
      </div>
  );
};

 export default PieChart;
