const hello = async (err) => {
    if (err) {
        throw new Error("An error occurred");
    }
    setTimeout(() => {
        console.log("Hello, World!");
        return "Hello, World!";
    }, 1000);
}

(async () => {
    try {
        await hello(false); // This will throw an error
    } catch (error) {
        console.error("Caught an error:", error.message);
    }
})();