import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './Card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className='flex justify-evenly items-center flex-wrap gap-4 h-screen w-full'>
      <Card title='iPhone 14' description='Latest Apple smartphone with advanced features' price={999}/>
      <Card title='MacBook Pro' description='Powerful laptop for professionals' price={2499}/>
      <Card title='AirPods Pro' description='Wireless earbuds with noise cancellation' price={249}/>
      <Card title='iPad Air' description='Versatile tablet for work and entertainment' price={599}/>
      <Card title='Apple Watch' description='Smart watch with health tracking' price={399}/>
      <Card title='iMac' description='All-in-one desktop computer' price={1299}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
      <Card title='Mac Mini' description='Compact desktop computer' price={699}/>
     </div>
    </>
  )
}

export default App
