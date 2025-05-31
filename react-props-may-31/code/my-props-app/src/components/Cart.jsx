import React from 'react'

function Cart({ count }) {
    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span>Cart</span>
            {count > 0 && (
                <span 
                    style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}
                >
                    {count}
                </span>
            )}
        </div>
    )
}

export default Cart