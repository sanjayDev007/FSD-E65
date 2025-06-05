import { useState } from 'react';
import './App.css'
import Navbar from './components/Navbar'
import WeatherContainer from './components/WeatherContainer';
import axios from 'axios';

function App() {
  const [search, setSearch] = useState('')
  const [weatherData, setWeatherData] = useState(null);

  async function fetchWeatherData() {
    if (!search) {
      setWeatherData(null);
      return;
    }
    const response = await axios(`https://api.weatherapi.com/v1/current.json?key=724d3a18eeab4254943131112250506&q=${search}&aqi=yes`);
    if (response.status === 200) {
      setWeatherData(response.data);
    } else {
      setWeatherData(null);
    }
  }
  return (
    <>
      <div className="container relative w-full h-full">
          <Navbar search={search} setSearch={setSearch} fetchWeatherData={fetchWeatherData}/>
          <WeatherContainer data={weatherData}/>
      </div>
    </>
  )
}

export default App
