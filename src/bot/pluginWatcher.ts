import Plugin = require('../bot/plugin');
var chokidar = require('chokidar');

export = PluginWatcher;

class PluginWatcher {
  public register = (callback) => {
    var watcher = chokidar.watch('./plugins/**/*.js', {
      ignored: /[\/\\]\./, persistent: true
    });

    var updatePlugin = (path) => {
      path = '../' + path;

      delete require.cache[require.resolve(path)];

      var pluginClass = require(path);

      var plugin = new pluginClass();

      if (this.isValidPlugin(plugin)) {
        callback(plugin);
      }
    };

    watcher.on('add', updatePlugin).on('change', updatePlugin);
  }

  private isValidPlugin(plugin: Plugin) {
    return (plugin && plugin.run && plugin.command && plugin.name);
  }
}