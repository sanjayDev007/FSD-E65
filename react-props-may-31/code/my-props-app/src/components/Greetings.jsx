import React from 'react'
function Greetings({ name = "Guest", age = 0}) {
    if (typeof name !== 'string' || !name.trim()) {
        name = "Guest";
    }

    if (typeof age !== 'number' || age < 0) {
        age = 0;
    }
  return (
    <>
        <div>
            Greetings Component
            <br />
            Name: {name}
            <br />
            Age: {age}
        </div>
        <br />
        <div>
            {age >= 18 && "You are an adult." || "You are a minor."}
        </div>
        <br />
        <br />
        <br />
        <br />
    </>
  )
}

export default Greetings