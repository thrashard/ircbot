import AppConfig = require('../appConfig');
import Message = require('./message');

export = new MessageCache();

class MessageCache {
    private messages: Message[] = [];
    private maxMessages: number;

    constructor() {
        AppConfig.getSettings('messageCache', (settings: any) => {
            this.maxMessages = settings.maxMessages;
        });
    }

    recordMessage(message: Message) {
        this.messages.push(message);

        //remove the first element in the array if we're over the allowed message count
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
        }
    }

    getMessages(amount: number): Message[] {
        if (amount > this.messages.length) {
            amount = this.messages.length;
        }

        return this.messages.slice(this.messages.length - amount);
    }
}