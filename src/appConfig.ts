var fs = require('fs');

export = AppConfig;

class AppConfig {
    public static getSettings = (key: string, callback: Function) => {
        AppConfig.loadSettings((settings: any) => {
            if (key) {
                settings = settings[key];
                if (!settings) {
                    throw 'No settings found for key: ' + key;
                }
            }

            return callback(settings);
        });
    }

    private static loadSettings(callback: Function) {
        fs.readFile('./appConfig.json', 'utf8', function (err, data) {
            if (err) {
                throw err;
            }

            callback(JSON.parse(data));
        });
    }
}