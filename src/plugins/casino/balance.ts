import Plugin = require('../../bot/plugin');
import Message = require('../../bot/message');
import Casino = require('./casino');

export = Balance;

class Balance implements Plugin {
  public command = 'balance';
  public run(message: Message, reply: Function): void {
    Casino.getPlayerBalance(message.nick, (balance) => {
      reply('Your casino balance is: ' + balance);
    });
  }
}