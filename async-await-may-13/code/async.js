//#region Callbacks

// function getUserData(userId, callback) {
//     if (!userId) {
//         callback(null, "User ID is required");
//     }
//     callback({ id: userId, name: "Alex", age: 15 }, null);
// }

// getUserData(123, function (result, err) {
//     if (err) {
//         console.error("Error:", err);
//     }
//     console.log("Got the user:", result.name);
// });

//# endregion

//#region Promises
// Getting user data the promise way
// function getUserDataPromise(userId) {
//     return new Promise((resolve, reject) => {
//         if (!userId) {
//             reject("User ID is required");
//         }
//         resolve({ id: userId, name: "Alex", age: 15 });
//     });
//   }
// getUserDataPromise(123)
//     .then((result) => {
//         console.log("Got the user:", result.name);
//         return "User data is valid";
//     }).then((message) => {
//         console.log(message);
//         return "User data is processed";
//     }).then((message) => {
//         console.log(message);
//         return "User data is saved";
//     })
//     .catch((err) => {
//         console.error("Error:", err);
//     }).finally(() => {
//         console.log("Promise completed");
//     });
//# endregion


//#region Async/Await
// Getting user data the async/await way

// async function getUserDataAsync(userId) {
//     if (!userId) {
//         throw new Error("User ID is required");
//     }
//     console.log("Fetching user data...");
//     return { id: userId, name: "Alex", age: 15 };
// }

// async function main() {
//     try {
//         let result = await getUserDataAsync(123);
//         console.log("Got the user:", result.name);
//     } catch (err) {
//         console.error("Error:", err.message);
//     }
// }

// main();
//example
// async function main() {
//     try {
//         const response = await fetch("https://jsonplaceholder.typicode.com/users/1")
//         const result= await response.json();
//         console.log(result)
//         fetch("https://jsonplaceholder.typicode.com/users/1")
//             .then((response) =>{
//                 return response.json()
//             })
//             .then((data) => {
//                 console.log(data);
//             })
//             .catch((error) => {
//                 console.error("Error:", error);
//             });
//     } catch (err) {
//         console.error("Error:", err);
//     }
// }
// main();