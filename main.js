// Generated by CoffeeScript 2.0.2
(function() {
  var DiscordJs, Events, Minecraft, SimpleRcon, WebRcon, debugChannel, discordClient, errorNotification, reoccuringErrors, rustChannel, wRcon;

  SimpleRcon = require('simple-rcon');

  DiscordJs = require('discord.js');

  WebRcon = require("webrconjs");

  Events = require('./discordEvents.coffee');

  reoccuringErrors = 0;

  debugChannel = "";

  rustChannel = "";

  errorNotification = function(error) {
    if (reoccuringErrors > 10) {
      process.exit(1);
    }
    console.log(error);
    return debugChannel.send(error).then(reoccuringErrors++);
  };

  discordClient = function(token) {
    var discord;
    discord = new DiscordJs.Client();
    discord.login(token).catch(console.error);
    return discord.on("ready", function() {
      console.log('Connected to Discord Server');
      debugChannel = discord.channels.find("name", "debug");
      rustChannel = discord.channels.find("name", "rust-server");
      wRcon(process.env.RUST_IP, process.env.RUST_PORT, process.env.RUST_PASSWORD);
      return new Events(discord);
    });
  };

  wRcon = function(rustip, rustport, password) {
    wRcon = new WebRcon(rustip, rustport);
    wRcon.connect(password);
    wRcon.on("connect", function() {
      return console.log("Connected to Rust Server");
    });
    wRcon.on("disconnect", function() {
      return errorNotification("Disconnected from Rust Server");
    });
    wRcon.on("error", function(err) {
      return errorNotification(`wRcon ${err}`);
    });
    return wRcon.on("message", function(msg) {
      var playerJoin;
      if (msg.message.includes("has entered the game")) {
        playerJoin = msg.message.replace(/\[.*\]/, "");
        return rustChannel.fetchMessage(rustChannel.lastMessageID).then(function(message) {
          var rustJoin;
          if (playerJoin !== message.content) {
            rustChannel.send(playerJoin);
            rustJoin = playerJoin.replace("entered", "joined");
            return wRcon.run("say " + rustJoin, 0);
          }
        }).catch((function(error) {
          return errorNotification(error);
        }));
      } else {
        return console.log(msg.message);
      }
    });
  };

  Minecraft = function() {
    var client;
    client = new SimpleRcon({
      host: '192.168.1.53',
      port: '25575',
      password: 'egeeio',
      timeout: 10000
    });
    return client.connect();
  };

  discordClient(process.env.NUEVO);

}).call(this);

//# sourceMappingURL=main.js.map
