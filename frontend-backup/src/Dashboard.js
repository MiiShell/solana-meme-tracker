import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/coins');
        setCoins(response.data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter(coin =>
    coin.ticker?.toLowerCase().includes(search.toLowerCase()) ||
    coin.name?.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = {
    labels: coins[0]?.market_cap_history?.map(entry => entry.timestamp) || [],
    datasets: [
      {
        label: 'Market Cap',
        data: coins[0]?.market_cap_history?.map(entry => entry.market_cap) || [],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <TextField
        label="Search Coins"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '20px', width: '100%' }}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ticker</TableCell>
            <TableCell>Market Cap</TableCell>
            <TableCell>ATH Market Cap</TableCell>
            <TableCell>% from ATH</TableCell>
            <TableCell>Followers</TableCell>
            <TableCell>Follower Growth</TableCell>
            <TableCell>Sentiment Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCoins.map(coin => (
            <TableRow key={coin.ticker}>
              <TableCell>{coin.ticker}</TableCell>
              <TableCell>${coin.market_cap?.toLocaleString()}</TableCell>
              <TableCell>${coin.ath_market_cap?.toLocaleString()}</TableCell>
              <TableCell>{coin.ath_change?.toFixed(2)}%</TableCell>
              <TableCell>{coin.follower_count}</TableCell>
              <TableCell>{coin.growth_rate?.toFixed(2)}/day</TableCell>
              <TableCell>{coin.sentiment_score?.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {coins[0] && (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { position: 'top' }, title: { display: true, text: 'Market Cap Trend' } },
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;