import Plugin = require('../bot/plugin');
import Message = require('../bot/message');
import AppConfig = require('../appConfig');

import https = require('https');

export = ImageSearch;

class ImageSearch implements Plugin {
  public command = 'im';
  public run(message: Message, reply: Function): void {
    AppConfig.getSettings('imageSearch', (settings: any) => {
      var options = {
        host: 'www.googleapis.com',
        path: '/customsearch/v1?num=1&start=1&searchType=image' +
        '&cx=' + settings.cx +
        '&key=' + settings.key +
        '&q=' + encodeURIComponent(message.text)
      };

      var req = https.get(options, function (res) {
        var body = '';
        res.on('data', function (data) {
          body += data;
        });
        res.on('end', function () {
          var data = JSON.parse(body);

          var result = 'error';
          if (data && data.items && data.items[0]) {
            result = data.items[0].link;
          }

          reply(result);
        });
      });
      req.on('error', function (e) {
        console.log(e);
        reply('error');
      });
    });
  }
}