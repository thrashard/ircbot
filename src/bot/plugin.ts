import Message = require('./message');

export = Plugin;

interface Plugin {
    command: string;
    run(message: Message, reply: Function): void;
}