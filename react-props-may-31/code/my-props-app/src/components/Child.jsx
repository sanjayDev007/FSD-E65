import React from 'react'
import ChildChild from './ChildChild';

function Child({properties}) {
  console.log(properties);
  let newProperties = {...properties};
 delete newProperties.rich; // Modifying the properties object
  return (
    <div>
      Child Properties
      <br />
      {JSON.stringify(properties)}

      <br />
      new Properties he spent money and become poor
        <br />
      <ChildChild properties={newProperties} />
    </div>
  )
}

export default Child