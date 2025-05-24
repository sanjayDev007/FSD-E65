class Local {
    #store = {
            "name": "Local Storage",
     };
    constructor() {
        this.test = "This is a test";
    }
    static hey() {
        return "Hey from Local Storage!";
    }
    setItem(key, value) {
        if (typeof key !== 'string') {
            throw new TypeError("Key must be a string");
        }
        this.#store[key] = value;
    }
    getItem(key) {
        return this.#store[key];
    }
    removeItem(key) {
        delete this.#store[key];
    }
    clear() {
        this.#store = {};
    }
    length() {
        return Object.keys(this.#store).length;
    }
    key(index) {
        return Object.keys(this.#store)[index];
    }
    toString() {
        return JSON.stringify(this.#store);
    }
    testFunction() {
        const test = () => {
           console.log(this.test);
        }
        test();
    }
}

const localStorage = new Local();
localStorage.testFunction();