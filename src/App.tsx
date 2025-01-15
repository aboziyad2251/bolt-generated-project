import React, { useState, useEffect } from 'react';
    import { Line } from 'react-chartjs-2';
    import {
      Chart as ChartJS,
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
    } from 'chart.js';

    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );

    const App = () => {
      const [currentPage, setCurrentPage] = useState<'monitor' | 'apps'>('monitor');
      return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCurrentPage('monitor')}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: currentPage === 'monitor' ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Monitor
            </button>
            <button
              onClick={() => setCurrentPage('apps')}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: currentPage === 'apps' ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Top Apps
            </button>
          </div>

          {currentPage === 'monitor' ? <MonitorPage /> : <TopAppsPage />}
        </div>
      );
    };

    const MonitorPage = () => {
      const totalRamGB = 32;
      const [current, setCurrent] = useState(0);
      const [power, setPower] = useState(0);
      const [energy, setEnergy] = useState(0);
      const [cpuLoad, setCpuLoad] = useState(0);
      const [ramLoad, setRamLoad] = useState(0);
      const [ramRemainingGB, setRamRemainingGB] = useState(totalRamGB);
      const [isMonitoring, setIsMonitoring] = useState(true);
      const [dataPoints, setDataPoints] = useState<number[]>([]);
      const [cpuPoints, setCpuPoints] = useState<number[]>([]);
      const [ramLoadPoints, setRamLoadPoints] = useState<number[]>([]);
      const [ramRemainingPoints, setRamRemainingPoints] = useState<number[]>([]);

      useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isMonitoring) {
          interval = setInterval(() => {
            // Get power data
            const currentValue = Math.random() * 1000;
            const voltage = 5;
            const powerValue = currentValue * voltage;
            
            setCurrent(currentValue);
            setPower(powerValue);
            setEnergy(prev => prev + (powerValue / 1200));
            setDataPoints(prev => [...prev.slice(-199), powerValue]);

            // Simulate CPU load
            const baseCpuLoad = Math.random() * 30;
            const cpuSpikeChance = Math.random();
            const cpuPercentage = cpuSpikeChance > 0.9 ? 
              Math.min(100, baseCpuLoad + 70) : // Simulate occasional spikes
              Math.min(100, baseCpuLoad + Math.random() * 20); // Normal variation
            
            setCpuLoad(cpuPercentage);
            setCpuPoints(prev => [...prev.slice(-199), cpuPercentage]);

            // Simulate RAM usage
            const baseRamLoad = Math.random() * 30;
            const ramSpikeChance = Math.random();
            const ramPercentage = ramSpikeChance > 0.85 ?
              Math.min(100, baseRamLoad + 50) : // Simulate occasional spikes
              Math.min(100, baseRamLoad + Math.random() * 15); // Normal variation
            
            const ramUsedGB = (ramPercentage / 100) * totalRamGB;
            const ramRemaining = totalRamGB - ramUsedGB;
            
            setRamLoad(ramPercentage);
            setRamRemainingGB(ramRemaining);
            setRamLoadPoints(prev => [...prev.slice(-199), ramUsedGB]);
            setRamRemainingPoints(prev => [...prev.slice(-199), ramRemaining]);
          }, 3000);

          // Run first update immediately
          const currentValue = Math.random() * 1000;
          const voltage = 5;
          const powerValue = currentValue * voltage;
          const initialRamLoad = Math.random() * 40;
          const initialRamUsedGB = (initialRamLoad / 100) * totalRamGB;
          
          setCurrent(currentValue);
          setPower(powerValue);
          setEnergy(powerValue / 1200);
          setDataPoints([powerValue]);
          setCpuPoints([Math.random() * 50]);
          setRamLoadPoints([initialRamUsedGB]);
          setRamRemainingPoints([totalRamGB - initialRamUsedGB]);
        }

        return () => clearInterval(interval);
      }, [isMonitoring]);

      const toggleMonitoring = () => {
        setIsMonitoring(prev => !prev);
      };

      const powerChartData = {
        labels: dataPoints.map((_, i) => `${(i + 1) * 3} sec`),
        datasets: [
          {
            label: 'Power (W)',
            data: dataPoints,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      };

      const cpuChartData = {
        labels: cpuPoints.map((_, i) => `${(i + 1) * 3} sec`),
        datasets: [
          {
            label: 'CPU Load (%)',
            data: cpuPoints,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }
        ]
      };

      const ramUsageChartData = {
        labels: ramLoadPoints.map((_, i) => `${(i + 1) * 3} sec`),
        datasets: [
          {
            label: 'RAM Usage (GB)',
            data: ramLoadPoints,
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
          }
        ]
      };

      const ramRemainingChartData = {
        labels: ramRemainingPoints.map((_, i) => `${(i + 1) * 3} sec`),
        datasets: [
          {
            label: 'Remaining RAM (GB)',
            data: ramRemainingPoints,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
          }
        ]
      };

      return (
        <>
          <div style={{ marginBottom: '20px' }}>
            <p>Current: {current.toFixed(2)} mA</p>
            <p>Power: {power.toFixed(2)} W</p>
            <p>Energy: {energy.toFixed(2)} Wh</p>
            <p>CPU Load: {cpuLoad.toFixed(2)}%</p>
            <p>RAM Usage: {(totalRamGB - ramRemainingGB).toFixed(2)} GB / {totalRamGB} GB</p>
            <p>Remaining RAM: {ramRemainingGB.toFixed(2)} GB</p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3>Power Consumption</h3>
            <div style={{ height: '200px', marginBottom: '20px' }}>
              <Line
                data={powerChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Power (W)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3>CPU Load</h3>
            <div style={{ height: '200px', marginBottom: '20px' }}>
              <Line
                data={cpuChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'CPU Load (%)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3>RAM Usage</h3>
            <div style={{ height: '200px', marginBottom: '20px' }}>
              <Line
                data={ramUsageChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: totalRamGB,
                      title: {
                        display: true,
                        text: 'RAM Usage (GB)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3>Remaining RAM</h3>
            <div style={{ height: '200px', marginBottom: '20px' }}>
              <Line
                data={ramRemainingChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: totalRamGB,
                      title: {
                        display: true,
                        text: 'Remaining RAM (GB)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <button
            onClick={toggleMonitoring}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: isMonitoring ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isMonitoring ? 'Stop' : 'Start'}
          </button>
        </>
      );
    };

    const TopAppsPage = () => {
      const [topMemoryApps, setTopMemoryApps] = useState<
        { name: string; memoryUsageGB: number }[]
      >([]);

      const generateRandomApps = () => {
        const apps = [
          'Chrome',
          'Visual Studio Code',
          'Node.js',
          'Spotify',
          'Docker',
          'Slack',
          'Postman',
          'Figma',
          'Zoom',
          'Discord',
          'Photoshop',
          'Excel',
          'PowerPoint',
          'Teams',
          'Terminal',
        ];
        return apps
          .sort(() => Math.random() - 0.5)
          .slice(0, 10)
          .map((app) => ({
            name: app,
            memoryUsageGB: parseFloat((Math.random() * 4 + 0.5).toFixed(2)), // Between 0.5GB and 4.5GB
          }))
          .sort((a, b) => b.memoryUsageGB - a.memoryUsageGB);
      };

      useEffect(() => {
        const interval = setInterval(() => {
          setTopMemoryApps(generateRandomApps());
        }, 3000);

        // Initial load
        setTopMemoryApps(generateRandomApps());

        return () => clearInterval(interval);
      }, []);

      return (
        <div>
          <h2>Top 10 Memory-Using Applications</h2>
          <table style={{ width: '100%', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Application</th>
                <th style={{ textAlign: 'right' }}>Memory Usage (GB)</th>
              </tr>
            </thead>
            <tbody>
              {topMemoryApps.map((app, index) => (
                <tr key={index}>
                  <td>{app.name}</td>
                  <td style={{ textAlign: 'right' }}>{app.memoryUsageGB.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    export default App;
