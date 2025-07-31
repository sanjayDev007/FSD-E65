const crypto = require('crypto');

class Operations {
    constructor(db, schema) {
        this.db = db;
        this.schema = schema;
    }

    validate(item) {
        for (const key in this.schema) {
            if (this.schema[key].required && !(key in item)) {
                throw new Error(`Missing required field: ${key}`);
            }
        }
        return true;
    }

    find(query = {}) {
        const data = this.db.read();
        return data.filter(record =>
            Object.keys(query).every(key => record[key] === query[key])
        );
    }

    create(item) {
        // Generate a random id if not present
        if (!item.id) {
            item.id = crypto.randomUUID();
        }
        this.validate(item);
        this.db.add(item);
        return item;
    }

    update(query, updates) {
        const data = this.db.read();
        let updated = false;
        const newData = data.map(record => {
            if (Object.keys(query).every(key => record[key] === query[key])) {
                updated = true;
                return { ...record, ...updates };
            }
            return record;
        });
        if (updated) this.db.write(newData);
        return updated;
    }

    delete(query) {
        const data = this.db.read();
        const newData = data.filter(record =>
            !Object.keys(query).every(key => record[key] === query[key])
        );
        const deleted = data.length !== newData.length;
        if (deleted) this.db.write(newData);
        return deleted;
    }
}

module.exports = Operations;
