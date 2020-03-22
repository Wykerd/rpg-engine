export enum DebugLevel {
    none,
    error,
    warn,
    log,
    additional,
    all
};

class Debugger {
    private level : DebugLevel = DebugLevel.none;

    constructor (level = DebugLevel.none) {
        this.level = level;
    }

    public log(event : string, message: string, ...args : any) {
        if (this.level >= DebugLevel.log) console.log(`%c ${event}: %c %s`, 'background: #bada55; color: #222', 'color: #000', message, ...args)
    }

    public error(e : Error, ...args : any) {
        if (this.level >= DebugLevel.error) console.error(`%c ${e.name}: %c %s`, 'background: #fe4101; color: #fff', 'color: #000', e.message, ...args, '\n', e)
    }

    public warn(e : Error | string, ...args: any) {
        if (this.level >= DebugLevel.error)
        if (e instanceof Error) console.warn(`%c ${e.name}: %c %s`, 'background: #ffd34f; color: #000', 'color: #000', e.message, ...args, '\n', e);
        else console.warn(`%c Warning: %c %s`, 'background: #ffd34f; color: #000', 'color: #000', e, ...args)
    }

    public show(level = DebugLevel.log) {
        this.level = level;
        this.log('Debuggger', 'Log level set to ' + this.level);
    }
}

export default new Debugger(DebugLevel.all);