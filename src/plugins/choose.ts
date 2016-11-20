import Plugin = require('../bot/plugin');
import Message = require('../bot/message');

export = Choose;

class Choose implements Plugin {
  public command = 'choose';
  public run(message: Message, reply: Function): void {
    var options = message.text.split(',');
    var idx = Math.floor(Math.random() * options.length);
    var result = options[idx].trim();
    reply(result);
  }
}