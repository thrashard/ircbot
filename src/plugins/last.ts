import Plugin = require('../bot/plugin');
import Message = require('../bot/message');
import MessageCache = require('../bot/messageCache');

export = Last;

class Last extends Plugin {
    public command = 'last';
    public run(message: Message, reply: Function): void {
        //default to one message
        var amount: number = message.text ? Number(message.text) : 1;

        if (isNaN(amount)) {
            amount = 0;
        }

        if (amount === 0) {
            return;
        }

        var messages: Message[] = MessageCache.getMessages(amount);

        var output: string = '';

        for (var i = 0; i < messages.length; i++) {
            var m = messages[i];
            output += '<' + m.nick + '>: ' + m.fullText.trim() + '; ';
        }

        reply(output.trim());
    }
}