import Plugin = require('../bot/plugin');
import Message = require('../bot/message');
import https = require('https');

export = EveId;

class EveId extends Plugin {
  public command = 'eveid';
  public run(message: Message, reply: Function): void {
    var options = {
      host: 'api.eveonline.com',
      path: '/eve/CharacterID.xml.aspx?names=' + encodeURIComponent(message.text)
    };

    https.get(options, function (res) {
      var body = '';
      res.on('data', function (data) {
        body += data;
      }).on('end', function () {
        reply(body);
      });
    }).on('error', function (e) {
      console.log(e);
      reply('error connecting to eve api');
    });
  }
}