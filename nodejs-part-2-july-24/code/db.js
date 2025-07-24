const fs = require('fs');
const path = require('path');

class DB {
    constructor(filePath = path.join(__dirname, 'db.json')) {
        this.filePath = filePath;
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify({}), 'utf8');
        }
        this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    }

    _save() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        this._save();
    }

    delete(key) {
        delete this.data[key];
        this._save();
    }

    clear() {
        this.data = {};
        this._save();
    }
    findOne(predicate) {
        for (const [key, value] of Object.entries(this.data)) {
            if (predicate(value, key)) {
                return value;
            }
        }
        return undefined;
    }

    findMany(predicate) {
        const results = [];
        for (const [key, value] of Object.entries(this.data)) {
            if (predicate(value, key)) {
                results.push(value);
            }
        }
        return results;
    }
}

module.exports = DB;