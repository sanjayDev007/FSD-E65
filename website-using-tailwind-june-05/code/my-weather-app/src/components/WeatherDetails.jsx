import React from 'react'

function WeatherDetails({ data }) {
    const { location, current } = data;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl shadow-2xl text-white">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">{location.name}</h1>
                <p className="text-blue-100">{location.region}, {location.country}</p>
                <p className="text-sm text-blue-200">{location.localtime}</p>
            </div>

            {/* Main Weather Info */}
            <div className="flex items-center justify-center mb-8">
                <img 
                    src={`https:${current.condition.icon}`} 
                    alt={current.condition.text}
                    className="w-20 h-20 mr-4"
                />
                <div className="text-center">
                    <div className="text-6xl font-light dark:text-black">{current.temp_c}°</div>
                    <div className="text-xl">{current.condition.text}</div>
                    <div className="text-blue-200">Feels like {current.feelslike_c}°C</div>
                </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center card-hover">
                    <div className="text-2xl font-semibold">{current.humidity}%</div>
                    <div className="text-sm text-blue-100">Humidity</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center card-hover">
                    <div className="text-2xl font-semibold">{current.wind_kph}</div>
                    <div className="text-sm text-blue-100">Wind (km/h)</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center card-hover">
                    <div className="text-2xl font-semibold">{current.pressure_mb}</div>
                    <div className="text-sm text-blue-100">Pressure (mb)</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center card-hover">
                    <div className="text-2xl font-semibold">{current.vis_km}</div>
                    <div className="text-sm text-blue-100">Visibility (km)</div>
                </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 card-hover">
                    <h3 className="text-lg font-semibold mb-3">Wind Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Direction:</span>
                            <span>{current.wind_dir} ({current.wind_degree}°)</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Speed:</span>
                            <span>{current.wind_mph} mph</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Gust:</span>
                            <span>{current.gust_kph} km/h</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 card-hover">
                    <h3 className="text-lg font-semibold mb-3">Air Quality</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>PM2.5:</span>
                            <span>{current.air_quality.pm2_5} μg/m³</span>
                        </div>
                        <div className="flex justify-between">
                            <span>PM10:</span>
                            <span>{current.air_quality.pm10} μg/m³</span>
                        </div>
                        <div className="flex justify-between">
                            <span>EPA Index:</span>
                            <span>{current.air_quality['us-epa-index']}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherDetails