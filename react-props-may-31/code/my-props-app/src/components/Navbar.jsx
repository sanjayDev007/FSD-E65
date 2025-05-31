import React from 'react'
import Cart from './Cart'

function Navbar({count, setCount}) {
    return (
        <nav style={{
            backgroundColor: '#333',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white'
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Brand
            </div>
            <button onClick={() => setCount(count + 5)}>
                Add 5
            </button>
            <ul style={{
                display: 'flex',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                gap: '2rem'
            }}>
                <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
                <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>About</a></li>
                <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contact</a></li> 
                <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                    <Cart count={count} />
                    </a></li> 
            </ul>
        </nav>
    )
}

export default Navbar