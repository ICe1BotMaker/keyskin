const { default: Keyskin } = require(`../`);
const fs = require(`fs`);
const cors = require(`cors`);
const path = require(`path`);

const keyskin = new Keyskin({ autolog: false });

keyskin.use(cors());

keyskin.on(`get`, `/message/send`, (req, res) => {
    keyskin.write(`[${req.query.sender}] ${req.query.msg}`);

    const logConfig = JSON.parse(fs.readFileSync(`./log/config.json`, `utf-8`));
    const log = fs.readFileSync(`./log/${logConfig.latest}`, `utf-8`).replace(/\n/g, `<br>`);

    res.send({ log });
});

keyskin.on(`get`, `/message/log`, (req, res) => {
    const logConfig = JSON.parse(fs.readFileSync(`./log/config.json`, `utf-8`));
    const log = fs.readFileSync(`./log/${logConfig.latest}`, `utf-8`).replace(/\n/g, `<br>`);

    res.send({ log });
});

keyskin.on(`get`, `/`, (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/index.html`));
});

keyskin.listen(8080, () => {
    // keyskin.write(`http://localhost:${keyskin.port}`);
});