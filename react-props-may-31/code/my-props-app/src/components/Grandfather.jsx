import React from 'react'
import Father from './Father';

function Grandfather() {
    const properties = {
        angry: true,
        color: 'brown',
        bigFoot: true
    };
  return (
    <div>Grandfather Properties
        <br />
        {JSON.stringify(properties)}
        <br />
        <Father properties={properties}/>
    </div>
  )
}

export default Grandfather