import Plugin = require('../../bot/plugin');
import Message = require('../../bot/message');
import Casino = require('./casino');

export = Slots;

class Slots implements Plugin {
    public command = 'slots';
    public run(message: Message, reply: Function): void {
        Casino.getPlayerBalance(message.nick, (balance: number) => {
            var betAmount: number = parseInt(message.text);

            if (isNaN(betAmount) || betAmount <= 0) {
                return reply('You can\'t bet that much, moron');
            }

            if (balance < betAmount) {
                return reply('Your casino balance is less than the bet amount. Balance: ' + balance);
            }

            balance -= betAmount;

            var slotOutput: any[] = ['*', '*', '*'];

            for (var i = 0; i < slotOutput.length; i++) {
                var result = Math.floor(Math.random() * (10) + 1);
                slotOutput[i] = result;
                reply(slotOutput.join(' '));
            }

            //payout based on the result
            var sameNumbers = 1;

            if (slotOutput[0] === slotOutput[1]) {
                sameNumbers++;
            } if (slotOutput[0] === slotOutput[2]) {
                sameNumbers++;
            } if (slotOutput[1] === slotOutput[2]) {
                sameNumbers++;
            }

            if (sameNumbers === 3) {
                reply('You have won: ' + betAmount * 10);
                balance += betAmount * 10;
            } else if (sameNumbers === 2) {
                reply('You have won: ' + betAmount * 3);
                balance += betAmount * 3;
            } else {
                reply('You have lost: ' + betAmount);
            }

            return Casino.setPlayerBalance(message.nick, balance);
        });
    }
}