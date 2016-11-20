import Plugin = require('../bot/plugin');
import Message = require('../bot/message');

export = Echo;

class Echo extends Plugin {
  public name = 'echo';
  public command = '!echo';
  public run(message: Message, reply: Function): void {
    reply(message.text);
  }
};