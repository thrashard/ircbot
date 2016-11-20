import Plugin = require('../bot/plugin');
var chokidar = require('chokidar');

export = PluginWatcher;

declare type PluginCallback = (p: Plugin) => void;

class PluginWatcher {
  public register(callback: PluginCallback): void {
    var watcher = chokidar.watch('./plugins/**/*.js', {
      ignored: /[\/\\]\./, persistent: true
    });

    var updatePlugin = (path: string) => {
      path = '../' + path;

      delete require.cache[require.resolve(path)];

      var plugin = require(path);

      var pluginInstance: Plugin = new plugin();

      if (this.isValidPlugin(pluginInstance)) {
        callback(pluginInstance);
      }
    };

    watcher.on('add', updatePlugin).on('change', updatePlugin);
  }

  private isValidPlugin(plugin: Plugin): boolean {
    return Boolean(plugin && plugin.run && plugin.command);
  }
}