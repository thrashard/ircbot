import Message = require('./message');

export = Plugin;

abstract class Plugin {
    public abstract name: string;
    public abstract command: string;
    public abstract run(message: Message, reply: Function): void;
}