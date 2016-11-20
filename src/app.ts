let PluginWatcher = require('./bot/pluginWatcher');
let IrcBot = require('./bot/ircBot');
let AppConfig = require('./appConfig');

AppConfig.getSettings('ircServer', (settings: any) => {
  let bot = new IrcBot();

  bot.connect({
    host: settings.host,
    port: settings.port,
    password: settings.password,
    username: settings.username,
    nickname: settings.username,
    realname: settings.username,
    channel: settings.channel
  });

  let watcher = new PluginWatcher();

  watcher.register(bot.registerPlugin);
});