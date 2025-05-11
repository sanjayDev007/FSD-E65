// Getting user data the callback way
function fetch1(url, callback) {// userId type: string, callback type: function
    if (!url) {
        callback(null, new Error("URL is required"));
        return;
    }
    let userData = [{userId: "123", name: "John Doe"}, {userId: "456", name: "Jane Doe"}];
    callback(userData, null);
}

function fetch2(url) {// userId type: string
    return new Promise((resolve, reject) => {
        if (!url) {
            reject(new Error("URL is required"));
            return;
        }
        let userData = [{userId: "123", name: "John Doe"}, {userId: "456", name: "Jane Doe"}];
        resolve(userData);
    });
}

// call frontend
fetch1(null, function (result , err) {
    if (err) {
        console.error("Error fetching data:", err);
        return;
    }
    console.log("User data:", result);
});

fetch2(null)
    .then(result => {
        console.log("User data:", result);
    })
    .catch(err => {
        console.error("Error fetching data:", err);
    }).finally(() => {
        console.log("Fetch operation completed");
    })