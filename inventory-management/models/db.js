const fs = require('fs');
const path = require('path');

class JsonDb {
    constructor(filename) {
        this.filePath = path.resolve(__dirname, filename);
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf8');
        }
    }

    read() {
        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data);
    }

    write(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    add(item) {
        const data = this.read();
        data.push(item);
        this.write(data);
    }
}

module.exports = JsonDb;