import xmlrpc from 'xmlrpc';

export type OdooConfig = {
    url: string;
    db: string;
    username: string;
    password: string;
};

export type OdooKWMethod =
    | 'search_read'
    | 'search_count'
    | 'fields_get'
    | 'search'
    | 'read'
    | 'write'
    | 'create'
    | 'unlink';

export class OdooXMLRPC {
    private config: OdooConfig;
    private client: xmlrpc.Client;
    private uid: number = 0;

    constructor(config: OdooConfig) {
        this.config = config;
        this.client = this.makeClient('/xmlrpc/2/object');
    }

    private makeClient(path: string): xmlrpc.Client {
        const url = new URL(this.config.url);
        const clientOptions = {
            host: url.hostname,
            port: parseInt(url.port, 10),
            path: path,
        };
        return url.protocol === 'https:'
            ? xmlrpc.createSecureClient(clientOptions)
            : xmlrpc.createClient(clientOptions);
    }

    private async call<T>(
        method: string,
        params: any[],
        client?: xmlrpc.Client,
    ) {
        return (await new Promise((resolve, reject) => {
            (client || this.client).methodCall(
                method,
                params,
                (error, value) => {
                    error ? reject(error) : resolve(value);
                },
            );
        })) as T;
    }

    public async authenticate(): Promise<number> {
        const uid = await this.call<number>(
            'authenticate',
            [this.config.db, this.config.username, this.config.password, {}],
            this.makeClient('/xmlrpc/2/common'),
        );
        if (!uid) {
            throw new Error('Invalid credentials');
        }
        this.uid = uid;
        return uid;
    }

    /**
     * Executes a method on a specified Odoo model using the XML-RPC API.
     *
     * @template T The type of the result returned by the method.
     * @param model The name of the Odoo model.
     * @param method The name of the method to execute.
     * @param params The parameters to pass to the method.
     * @returns A promise that resolves to the result of the method execution.
     */
    public async execute_kw<T>(
        model: string,
        method: OdooKWMethod,
        ...params: any[]
    ) {
        return await this.call<T>('execute_kw', [
            this.config.db,
            this.uid,
            this.config.password,
            model,
            method,
            ...params,
        ]);
    }

    /**
     * Executes a method on a model in Odoo using XML-RPC. This is a shorthand method that
     * calls {@link Odoo.execute_kw} with the specified model and method.
     *
     * @param model - The name of the model to execute the method on.
     * @param method - The method to execute on the model.
     * @param params - The parameters to pass to the method.
     * @returns A promise that resolves to the result of the method execution.
     * @template T - The type of the result.
     */
    public async execute<T>(
        model: string,
        method: OdooKWMethod,
        ...params: any[]
    ) {
        return await this.execute_kw<T>(model, method, ...params);
    }

    /**
     * Executes a workflow for a given model and method.
     *
     * @param model - The name of the model.
     * @param method - The name of the method.
     * @param params - Additional parameters for the method.
     * @returns A promise that resolves to the result of the workflow execution.
     */
    public async exec_workflow(
        model: string,
        method: string,
        ...params: any[]
    ): Promise<unknown> {
        return await this.call('exec_workflow', [
            this.config.db,
            this.uid,
            this.config.password,
            model,
            method,
            ...params,
        ]);
    }

    /**
     * Renders a report using the specified parameters.
     *
     * @param report - The name of the report to render.
     * @param params - Additional parameters for the report.
     * @returns A promise that resolves to the rendered report.
     */
    public async render_report(
        report: string,
        ...params: any[]
    ): Promise<unknown> {
        return await this.call('render_report', [
            this.config.db,
            this.uid,
            this.config.password,
            report,
            ...params,
        ]);
    }
}
