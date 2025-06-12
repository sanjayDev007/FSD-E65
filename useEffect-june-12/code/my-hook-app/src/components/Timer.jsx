import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
const [isRunning, setIsRunning] = useState(true);
  useEffect(() => {
    console.log('Setting up timer');
    
    // Setup: Create the timer
    let intervalId = null;
    if (isRunning) {
      // Start the timer only if isRunning is true
      console.log('Starting timer');
      intervalId = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    // Cleanup: Clear the timer when component unmounts
    return () => {
      console.log('Cleaning up timer');
      clearInterval(intervalId);
    };
  }, [isRunning]);

return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Timer</h1>
            <p className="text-6xl font-mono text-blue-600 mb-8">{seconds}s</p>
            <div className="flex gap-4 mb-4">
                <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                        isRunning 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                    }`}
                >
                    {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button 
                    onClick={() => setSeconds(0)}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                    Reset
                </button>
            </div>
            {isRunning && <p className="text-green-600 font-medium">Timer is running...</p>}
            {!isRunning && <p className="text-red-600 font-medium">Timer is paused.</p>}
        </div>
    </div>
)
  
}

export default Timer;