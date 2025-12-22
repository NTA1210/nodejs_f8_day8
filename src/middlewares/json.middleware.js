const jsonMiddleware = (req, _, next) => {
    let body = "";
    req.on("data", (buffer) => {
        body += buffer.toString();
    });
    req.on("end", () => {
        if (body) {
            req.body = JSON.parse(body);
        }
        next();
    });
};

module.exports = jsonMiddleware;
