let name = "sanjay";

//template
// This is a template file for demonstration purposes
console.log(`Hello, ${name}!`);


const arr = [1, 2, 3, 4, 5];

const [num1, num2,...remaining] = arr;
console.log(`First number: ${num1}, Second number: ${num2}, Remaining numbers: ${remaining}`);