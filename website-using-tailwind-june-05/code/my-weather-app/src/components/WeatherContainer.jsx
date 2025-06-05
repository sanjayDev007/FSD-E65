import React from "react";
import WeatherCard from "./WeatherCard";
import WeatherDetails from "./WeatherDetails";

function WeatherContainer({ data }) {
  return (
    <>
      {data? (
        <div className="w-full h-[100vh] flex flex-col items-center justify-center">
            {/* <WeatherCard data={data}/> */}
            <WeatherDetails data={data}/>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-2xl text-gray-500">No data available</h1>
        </div>
      )}
    </>
  );
}

export default WeatherContainer;
