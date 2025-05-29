import React from 'react'
import './Main.css'
import Card from '../Card/Card'
function Main() {
  return (
    <>
        <main className="main">
            <div className="main-container">
            <h1>Welcome to My First React App</h1>
            <p>This is a simple application to demonstrate React components.</p>
            <p>Explore the components and see how they work together!</p>
            </div>
            <div className='card-container'>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
            </div>
        </main>
    </>
  )
}

export default Main