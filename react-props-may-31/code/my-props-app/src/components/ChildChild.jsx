import React from 'react'

function ChildChild({properties}) {
  return (
    <>
        <div>
            ChildChild Properties
            <br />
            {JSON.stringify(properties)}
            <br />
        </div>
    </>
  )
}

export default ChildChild