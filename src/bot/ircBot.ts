import tls = require('tls');
import Plugin = require('./plugin');
import Message = require('./message');

export = ircBot;

class ircBot {
  private socket = null;
  private plugins: Plugin[] = [];

  public connect = (ircOpts):void => {
    let tlsOpts = {
      host: ircOpts.host,
      port: ircOpts.port,
      rejectUnauthorized: false
    };

    this.socket = tls.connect(tlsOpts, () => {
      console.log('connected to ' + tlsOpts.host + ':' + tlsOpts.port);

      this.socket.setEncoding('utf-8');
    });

    this.socket.writeIrc = (cmd, message) => {
      this.socket.write(cmd + ' ' + message + '\r\n');
    };

    this.socket.on('connect', (data) => {
      if (ircOpts.password) {
        this.socket.writeIrc('PASS', ircOpts.password);
      }

      this.socket.writeIrc('NICK', ircOpts.nickname);
      this.socket.writeIrc('USER', ircOpts.username + ' 8 * ' + ircOpts.realname);

      if (ircOpts.channel) {
        this.socket.writeIrc('JOIN', ircOpts.channel);
      }
    });

    this.socket.on('data', (data) => {
      let message = this.createMessage(data);
      this.processMessage(message);
    });

    this.socket.on('end', () => {
      console.log('disconnected');
    });

    this.socket.on('error', (error) => {
      console.log('error: ', error);
    });

    this.socket.on('close', () => {
      console.log('closed');
    });
  }

  public registerPlugin = (plugin: Plugin): void => {
    if (!plugin || !plugin.run || !plugin.command || !plugin.name) {
      console.warn('tried to register an invalid moldule: ' + JSON.stringify(plugin));
    }

    let pluginIdx = this.plugins.map(m => { return m.name; }).indexOf(plugin.name);

    if (pluginIdx !== -1) {
      console.info('updating plugin with name: ' + plugin.name);
      this.plugins.splice(pluginIdx, 1);
    } else {
      console.info('adding plugin with name: ' + plugin.name);
    }

    this.plugins.push(plugin);
  }

  private processMessage = (message): void => {
    switch (message.command) {
      case 'PING':
        return this.socket.writeIrc('PONG', message.args[0]);
      case 'PRIVMSG':
        message.channel = message.args[0];
        message.text = message.args[1];
        this.notifyPlugins(message);
    }
  }

  private sendMessage = (channel): Function => {
    return (message) => {
      this.socket.writeIrc('PRIVMSG', channel + ' :' + message.replace(/(\r\n|\n|\r)/gm, ''));
    };
  }

  private notifyPlugins = (message: Message): void => {
    let textParts = message.text.split(' ');
    let command = textParts.shift();

    message.text = textParts.join(' ');

    this.plugins.forEach(m => {
      if (m.command === command) {
        m.run(message, this.sendMessage(message.channel))
      }
    });
  }

  //https://github.com/martynsmith/node-irc/blob/master/lib/parse_message.js
  private createMessage(line: string) {
    let message = <Message>{};

    let match = line.match(/^:([^ ]+) +/);
    if (match) {
      message.prefix = match[1];
      line = line.replace(/^:[^ ]+ +/, '');
      match = message.prefix.match(/^([_a-zA-Z0-9\~\[\]\\`^{}|-]*)(!([^@]+)@(.*))?$/);
      if (match) {
        message.nick = match[1];
        message.user = match[3];
        message.host = match[4];
      }
      else {
        message.server = message.prefix;
      }
    }

    // Parse command
    match = line.match(/^([^ ]+) */);
    message.command = match[1];
    line = line.replace(/^[^ ]+ +/, '');

    message.args = [];
    let middle, trailing;

    // Parse parameters
    if (line.search(/^:|\s+:/) !== -1) {
      match = line.match(/(.*?)(?:^:|\s+:)(.*)/);
      middle = match[1].trim();
      trailing = match[2];
    }
    else {
      middle = line;
    }

    if (middle.length)
      message.args = middle.split(/ +/);

    if (typeof (trailing) != 'undefined' && trailing.length)
      message.args.push(trailing);

    return message;
  }
}