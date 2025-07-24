const http = require('http');
const path = require('path');
const url = require('url');
class Express {
    constructor() {
        this.routes = {
            get: {},
            post: {},
            put: {},
            delete: {}
        };
        this.middleware = [];
        this.bodyParser = this.bodyParser.bind(this);
    }

    get(path, handler) {
        console.log(`Registering GET handler for ${path}`);
        console.log(handler);
        this.routes.get[path] = handler;
    }
    post(path, handler) {
        this.routes.post[path] = handler;
    }
    put(path, handler) {
        this.routes.put[path] = handler;
    }
    delete(path, handler) {
        this.routes.delete[path] = handler;
    }
    use(middleware) {
        this.middleware.push(middleware);
    }

    bodyParser() {
        return (req, res, next) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    req.body = JSON.parse(body);
                } catch (e) {
                    req.body = {};
                }
                next();
            });
        };
    }

    listen(port, callback) {
        const server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const method = req.method.toLowerCase();
            const pathname = parsedUrl.pathname;

            console.log(`Received ${method.toUpperCase()} request for ${pathname}`);

            if (this.routes[method] && this.routes[method][pathname]) {
                console.log(`Found handler for ${method.toUpperCase()} ${pathname}`);
                const handler = this.routes[method][pathname];
                console.log(`Handler: ${handler}`);
                req.url = parsedUrl;
                req.method = method.toUpperCase();
                req.query = parsedUrl.query || {};
                req.body = {};

                // Run middleware stack
                let idx = 0;
                const next = () => {
                    if (idx < this.middleware.length) {
                        this.middleware[idx++](req, res, next);
                    } else {
                        handler(req, res);
                    }
                };
                res.sendData = (body) => {
                    if (typeof body === 'string') {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(body);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(body));
                    }
                };
                res.status = (code) => {
                    res.writeHead(code);
                    return res;
                };
                res.json = (body) => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(body));
                };
                next();
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });
        server.listen(port, callback);
    }
}
module.exports = Express;