import React, { useEffect } from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import { getCharts } from '../api/chart';

function Home() {
    const [data,setData] = React.useState([]);
    useEffect(() => {
      const fetchData = async () => {
        const result = await getCharts();
        setData(result);
      }
      fetchData();
    }, []);
  return (
    <>
      {data.length > 0 ? (
        data.map((chart) => (
            <BarChart
              key={chart._id}
              xAxis={[{ data: chart.data.map(item => item.key) }]}
              series={[{ data: chart.data.map(item => item.value) }]}
              width={500}
              height={300}
            />
        ))
      ) : (
        <p>No data available</p>
      )}
    </>
  )
}

export default Home