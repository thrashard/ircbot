var fs = require('fs');

export = Casino;

class Casino {
    public static getPlayerBalance = (nick, callback) => {
        Casino.loadBalances((balances) => {
            //new users get a balance of 1000
            if (balances[nick] == null) {
                Casino.setPlayerBalance(nick, 1000);
                return callback(1000);
            }
            var balance = balances[nick] != null ? balances[nick] : 'error';
            return callback(balance);
        });
    }

    public static setPlayerBalance(nick, newBalance) {
        Casino.loadBalances((balances) => {
            balances[nick] = newBalance;

            fs.writeFile('./plugins/casino/casinoBalances.json', JSON.stringify(balances), (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    }

    private static loadBalances(callback) {
        fs.readFile('./plugins/casino/casinoBalances.json', 'utf8', function (err, data) {
            if (err) {
                //create an empty balance file if it doesn't exist
                if (err.code === 'ENOENT') {
                    return fs.writeFile('./plugins/casino/casinoBalances.json', '{}', (err) => {
                        if (err) {
                            throw err;
                        }

                        return Casino.loadBalances(callback);
                    });
                }

                throw err;
            }

            callback(JSON.parse(data));
        });
    }
}