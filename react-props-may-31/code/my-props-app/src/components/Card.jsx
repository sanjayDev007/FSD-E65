import React from 'react'

function Card({title,price = 0, children, ...otherProps}) {
  return (
   <>
    <div className="card">
      <h2>{title}</h2>
      <p>Price: ${price}</p>
      <div className="card-content">
      {children}
      </div>
        <div className="card-meta">
          <p>Rating : {otherProps.rating || 3}</p>
          <p>Discount : {otherProps.discount || 0}</p>
          <p>Rating : {otherProps.review || 'Good'}</p>
        </div>
    </div>
    <style jsx>{`
      .card {
        border: 1px solid #ccc;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .card h2 {
        margin-top: 0;
      }
    `}</style>
   </>
  )
}

export default Card