import PluginWatcher = require('./bot/pluginWatcher');
import IrcBot = require('./bot/ircBot');
import AppConfig = require('./appConfig');
import MessageCache = require('./bot/messageCache');

AppConfig.getSettings('', (settings: any) => {
  let bot: IrcBot = new IrcBot(settings.messagePrefix);

  bot.connect({
    host: settings.ircServer.host,
    port: settings.ircServer.port,
    password: settings.ircServer.password,
    username: settings.ircServer.username,
    nickname: settings.ircServer.username,
    realname: settings.ircServer.username,
    channel: settings.ircServer.channel
  });

  let watcher: PluginWatcher = new PluginWatcher();
  
  watcher.register(bot.registerPlugin);

  if(settings.messageCache && settings.messageCache.enabled) {
      bot.messageCache = MessageCache;
  }
});