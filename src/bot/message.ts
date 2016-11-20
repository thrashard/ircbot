export = Message;

interface Message {
    text: string;
    channel: string;
    prefix: string;
    nick: string;
    user: string;
    host: string;
    server: string;
    command: string;
    args: Array<string>;
}