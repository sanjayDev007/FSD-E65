function processData(data, callback) {
    console.log("Processing:", data);
    // Do some work...
    callback(data.toUpperCase());
}

function displayResult(result) {
    console.log("Result:", result);
}

// Pass displayResult as a callback
processData("hello world", displayResult);