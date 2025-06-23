// BarChart.jsx
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS,BarElement,CategoryScale,LinearScale,Title,Tooltip,Legend} from "chart.js";
import { useEffect, useState } from "react";
import api from '../axiosconfig';
import Loader from '../Components/Loader'
import React from 'react'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = ({refreshTrigger}) => {
  const [summery, setSummery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummery = async () => {
    try {
      const response = await api.get('expenses/summery/');
      setSummery(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Failed to fetch summary:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummery();
  }, [refreshTrigger]);

  const labels = summery.map(item => item.label);
  const values = summery.map(item => item.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expenses (₹)',
        data: values,
        backgroundColor: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'],
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Expenses per Category (₹)',
        font: { size: 18 }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: context => `₹ ${context.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50
        }
      }
    }
  };

  return (
    <div className="w-full md:w-[600px] mx-auto mt-6 p-4 bg-white rounded-xl shadow">
      <h1 className="text-center text-2xl font-bold text-purple-800 mb-5">Expense on Each Category Overview</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Loader/>
        </div>
      ) : summery.length === 0 ? (
        <p className="text-center text-gray-500">No data available to show the chart.</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default React.memo(BarChart);