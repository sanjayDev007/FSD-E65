import React from "react";
import Child from "./Child";

function Father(props) {
  console.log(props);
  props.properties.rich = true;
  return <>
    <div>
      Father Properties
      <br />
      {JSON.stringify(props.properties)}
      <br />
      <Child properties={props.properties} />
    </div>
  </>;
}

export default Father;
