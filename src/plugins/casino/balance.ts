import Plugin = require('../../bot/plugin');
import Message = require('../../bot/message');
import Casino = require('./casino');

export = Balance;

class Balance extends Plugin {
  public name = 'balance';
  public command = '!balance';
  public run(message: Message, reply: Function): void {
    Casino.getPlayerBalance(message.nick, (balance) => {
      reply('Your casino balance is: ' + balance);
    });
  }
}