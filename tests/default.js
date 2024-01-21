const { default: Keyskin } = require(`../`);

const keyskin = new Keyskin();

keyskin.use((req, res, next) => {
    console.log(req.method);
    next();
});

keyskin.on(`get`, `/json`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);
    res.send({ a: 1, b: 2, c: 3 });
});

keyskin.listen(8080, () => {
    console.log(`localhost:${keyskin.port}`);
});