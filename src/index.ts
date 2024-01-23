// Import necessary modules from external packages
import { exec } from 'child_process';
import express from 'express';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

// Interface representing a route configuration.
export interface IRoute { type: (`get` | `post`); path: string; next: IRouteNextFunction; }
// Type representing the next function in a route configuration.
export interface IRouteNextFunction { (req: express.Request, res: express.Response): unknown; }
// Interface representing options for the Keyskin class.
export interface IOptions { autolog: boolean; }

/**
 * 💫 Keyskin - Easy and fast express monitoring.
 * 
 * ```js
 * const keyskin = new Keyskin({ autolog: false });
 * 
 * keyskin.use((req, res, next) => {
 *     keyskin.write(`${req.method} request.`);
 *     next();
 * });
 * 
 * keyskin.on(`get`, `/json`, (req, res) => {
 *     res.setHeader(`Content-type`, `application/json`);
 *     res.send({ a: 1, b: 2, c: 3 });
 * });
 * 
 * keyskin.listen(8080, () => {
 *     keyskin.write(`http://localhost:${keyskin.port}`);
 * });
 * ```
 */
export default class Keyskin {
    // Public properties with default values

    /**
     * The port on which the server will listen.
     */
    public port: number = 8080;

    /**
     * The name of the current log file.
     */
    public logName: string = ``;

    // Private properties with default values

    /**
     * Options for configuring the Keyskin application.
     */
    private options: IOptions = { autolog: true };

    /**
     * Array to store route configurations.
     */
    private routes: Array<IRoute> = [];

    /**
     * Express application instance.
     */
    private app: express.Application = express();

    /**
     * Class constructor for Keyskin.
     * @param options - Options for configuring the Keyskin application.
     */
    public constructor(options?: IOptions) {
        // Set provided options or use default values
        if (options) this.options = options;

        // Initialize the application
        this.init();
    }

    /**
     * Private initialization method.
     */
    private async init() {
        // Clear console for a clean start
        console.clear();

        // Display important information to the console
        console.log(chalk.yellow(`Problems may occur while using exec of child_process.`));
        console.log(`\nPreparing to run the graphical user interface.`);
    }

    /**
     * Private method to execute Qode with webpack configuration.
     * @returns A Promise that resolves when Qode execution is successful.
     */
    private async webpackQode() {
        // Display information about configuring the graphical user interface execution
        console.log(`Configuring the execution of the graphical user interface.\n`);

        // Use Promise to handle asynchronous execution of Qode
        return new Promise((res, rej) =>
            exec(`npx qode ${path.resolve(`${__dirname}/lib/gui.js`)}`, (error, _, stderr) => {
                if (error) rej(error);
                else {
                    // Resolve the promise and display a message when Qode execution is successful
                    res(true);
                    console.log(chalk.red(`The graphical user interface window is closed.\n`));
                }
            })
        );
    }

    /**
     * Public method to add middleware to the application.
     * @param next - The middleware function.
     */
    public use(next: IRouteNextFunction) {
        this.app.use(next);
    }

    /**
     * Public method to define routes for the application.
     * @param method - The HTTP method (get or post).
     * @param path - The route path.
     * @param next - The route handler function.
     */
    public on(method: (`get` | `post`), path: string, next: IRouteNextFunction) {
        // Add route information to the routes array
        this.routes = [...this.routes, { type: method, path, next }];
    }

    /**
     * Public method to start the server and listen on a specified port.
     * @param port - The port on which the server will listen.
     * @param next - Callback function to execute after the server starts listening.
     */
    public async listen(port: number = 8080, next: { (): unknown }) {
        // Set the provided or default port
        this.port = port;

        // Generate a unique log file name based on the current date and time
        const now = new Date();
        const year = now.getFullYear(), month = now.getMonth(), date = now.getDate(),
            hour = now.getHours(), minute = now.getMinutes(), second = now.getSeconds(), utc = now.toUTCString();
        this.logName = `${year}-${month}-${date}-${hour}-${minute}-${second}.log`;

        // Create a 'log' directory if it doesn't exist
        if (!fs.existsSync(`./log`) || (fs.existsSync(`./log`) && !fs.statSync(`./log`).isDirectory())) fs.mkdirSync(`./log`);

        // Create or update the log configuration file with the latest log file name
        const logConfig = { latest: this.logName };
        fs.writeFileSync(`./log/config.json`, JSON.stringify(logConfig, null, 4));

        // Write the start time to the log file
        fs.writeFileSync(`./log/${this.logName}`, utc);

        // Add middleware for automatic logging if autolog option is enabled
        if (this.options.autolog) {
            this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
                const now = new Date();
                const hour = now.getHours(), minute = now.getMinutes(), second = now.getSeconds();
                let log = fs.existsSync(`./log/${this.logName}`) ? fs.readFileSync(path.resolve(`./log/${this.logName}`), `utf-8`) : ``;
                log += `\n[${hour}:${minute}:${second}] ${req.method} ${req.path} :: ${req.ip}`;
                fs.writeFileSync(path.resolve(`./log/${this.logName}`), log, `utf-8`);
                next();
            });
        }

        // Register defined routes to the application
        this.routes.forEach(route => this.app[route.type](route.path, (req, res) => route.next(req, res)));

        // Start the server and execute the provided callback
        this.app.listen(this.port, next);

        // Execute additional tasks after the server has started
        await this.latest();
    }

    /**
     * Public method to write custom log entries.
     * @param texts - Array of strings to be written to the log.
     */
    public write(...texts: Array<string>) {
        const now = new Date();
        const hour = now.getHours(), minute = now.getMinutes(), second = now.getSeconds();
        let log = fs.existsSync(`./log/${this.logName}`) ? fs.readFileSync(path.resolve(`./log/${this.logName}`), `utf-8`) : ``;
        texts.forEach(text => log += `\n[${hour}:${minute}:${second}] ${text}`);
        fs.writeFileSync(path.resolve(`./log/${this.logName}`), log, `utf-8`);
    }

    /**
     * Private method to execute additional tasks after the server has started.
     */
    private async latest() {
        // Execute webpackQode method to configure and run the graphical user interface
        await this.webpackQode();
    }
}