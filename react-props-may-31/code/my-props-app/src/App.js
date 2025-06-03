import logo from './logo.svg';
import './App.css';
import Card from './components/Card';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Counter from './components/Counter';
import Loading from './components/Loading';
function App() {
  const [count, setCount] = useState(0);
  let loading = false; // Simulating loading state, set to false when data is ready
  if (loading) {
    return<>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading />
      </div>
    </>;
  }
  return (
    <div className="App">
      <Navbar count={count} setCount={setCount}/>
      <Counter count={count} setCount={setCount} />

     <button onClick={() => setCount(0)} style={{ margin: '20px', padding: '10px', fontSize: '16px' }}>
        Reset Count
      </button>

      <p className='text-green-500 text-2xl font-bold'>
        This is a simple React application with a counter and loading state.
      </p>

    </div>
  );
}

export default App;
