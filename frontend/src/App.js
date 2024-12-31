import React, { useState, useEffect } from 'react';
import Appcss from './App.css';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import axios from 'axios';

const App = () => {
    const [month, setMonth] = useState('03'); // Default month is March
    const [transactions, setTransactions] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [barChartData, setBarChartData] = useState({ labels: [], values: [] });
    const [pieChartData, setPieChartData] = useState({ labels: [], values: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch data when month changes
    useEffect(() => {
        setLoading(true);
        setError(null);

        Promise.all([
            fetchTransactions(),
            fetchStatistics(),
            fetchBarChartData(),
            fetchPieChartData()
        ])
        .then(() => setLoading(false))
        .catch((err) => {
            setError('Failed to load data');
            setLoading(false);
            console.error(err);
        });
    }, [month]);

    const fetchTransactions = async (search = '') => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions`, {
                params: { month, search }
            });
            setTransactions(response.data);
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        }
    };
    
    const fetchStatistics = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions/statistics`, { params: { month } });
            setStatistics(response.data);
        } catch (err) {
            console.error("Failed to fetch statistics", err);
        }
    };
    

    const fetchBarChartData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions/barchart`, { params: { month } });
            const data = response.data;
    
            // Transform the data: map `_id` to labels and `count` to values
            const labels = data.map(item => item._id.toString()); // Convert IDs to strings for labels
            const values = data.map(item => item.count);
    
            setBarChartData({
                labels,
                values
            });
    
            console.log("Transformed bar chart data:", { labels, values }); // Log the data for debugging
        } catch (err) {
            console.error("Failed to fetch bar chart data", err);
        }
    };

  

    const fetchPieChartData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions/piechart`, { params: { month } });
            const rawData = response.data;
    
            // Transform the data into labels and values
            const labels = rawData.map((item) => item._id); 
            const values = rawData.map((item) => item.count);
    
            setPieChartData({ labels, values }); 
            console.log("Transformed Pie Chart Data:", { labels, values });
        } catch (err) {
            console.error("Failed to fetch pie chart data", err);
        }
    };

    return (
        <div className="app">
            <h1 style={{ textAlign: 'center' }}>Transactions Dashboard</h1>

            {loading && <p>Loading data...</p>}
            {error && <p className="error">{error}</p>}

            <div className="month-selector">
                <label>Select Month:</label>
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
                        <option key={m} value={m}>{new Date(2021, m - 1).toLocaleString('en-US', { month: 'long' })}</option>
                    ))}
                </select>
            </div>

            {/* {/ Render components only if there's no loading and no error /} */}
            {!loading && !error && (
                <>
                    <TransactionsTable transactions={transactions} onSearch={fetchTransactions} />
                    <Statistics statistics={statistics} />
                    <BarChart data={barChartData} />
                    <PieChart data={pieChartData} />
                </>
            )}
        </div>
    );
};

export default App;

