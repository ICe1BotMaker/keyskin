import { exec } from 'child_process';
import express from 'express';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

export interface IRoute { type: (`get` | `post`); path: string; next: IRouteNextFunction; }
export interface IRouteNextFunction { (req: express.Request, res: express.Response): unknown; }

export default class Keyskin {
    public port: number = 8080;
    private routes: Array<IRoute> = [];
    private app: express.Application = express();
    
    public constructor() {
        this.init();
    }

    private async init() {
        console.log(chalk.yellow(`Problems may occur while using exec of child_process.`));
    }

    private async webpackQode() {
        await new Promise((res, rej) => 
            exec(`npx qode ${path.resolve(`${__dirname}/lib/gui.js`)}`, (error, _, stderr) => {
                if (error) rej(error);
                else res(true);
            })
        );
    }
    
    public use(next: IRouteNextFunction) {
        this.app.use(next);
    }
    
    public on(method: (`get` | `post`), path: string, next: IRouteNextFunction) {
        this.routes = [...this.routes, { type: method, path, next }];
    }
    
    public async listen(port: number = 8080, next: { (): unknown }) {
        this.port = port;
        
        const now = new Date();
        const year = now.getFullYear(), month = now.getMonth(), date = now.getDate(), hour = now.getHours(), minute = now.getMinutes(), second = now.getSeconds();
        const logName = `${year}-${month}-${date}-${hour}-${minute}-${second}.log`;
        if (!fs.existsSync(`./log`) || (fs.existsSync(`./log`) && !fs.statSync(`./log`).isDirectory())) fs.mkdirSync(`./log`);
        const config = { latest: logName };
        fs.writeFileSync(`./log/config.json`, JSON.stringify(config, null, 4));
        fs.writeFileSync(`./log/${logName}`, ``);

        this.app.use((req, res, next) => {
            const now = new Date();
            const hour = now.getHours(), minute = now.getMinutes(), second = now.getSeconds();
            let log = fs.existsSync(`./log/${logName}`) ? fs.readFileSync(path.resolve(`./log/${logName}`), `utf-8`) : ``;
            log += `\n[${hour}:${minute}:${second}] ${req.method} ${req.path} :: ${req.ip}`;
            fs.writeFileSync(path.resolve(`./log/${logName}`), log, `utf-8`);
            next();
        });

        this.routes.forEach(route => this.app[route.type](route.path, (req, res) => route.next(req, res)));
        this.app.listen(this.port, next);

        await this.latest();
    }

    private async latest() {
        await this.webpackQode();
    }
}