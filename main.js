// Generated by CoffeeScript 2.0.2
(function() {
  var DiscordJs, WebRcon, debugChannel, discord, notification, wRcon;

  WebRcon = require("webrconjs");

  DiscordJs = require('discord.js');

  discord = new DiscordJs.Client();

  discord.login(process.env.PYGUY);

  debugChannel = "";

  discord.on("ready", function() {
    return debugChannel = discord.channels.find("name", "debug");
  });

  // debugChannel.send("Teal is a buttface")
  wRcon = new WebRcon(process.env.RUST_IP, 28016);

  wRcon.connect(process.env.RUST_PASSWORD);

  wRcon.on("connect", function() {
    return console.log("Connected!");
  });

  wRcon.on("disconnect", function() {
    return notification("wRcon received a disconnect event.");
  });

  wRcon.on("error", function(err) {
    return notification(`wRcon failed: ${err}`);
  });

  wRcon.on("message", function(msg) {
    var playerName;
    if (msg.message.includes("has entered the game")) {
      playerName = msg.message.replace(/\[.*\]/, "");
      // debugChannel.send (msg.message)
      return console.log(playerName);
    }
  });

  // wRcon.run("say " + message, 0) if message.includes("has entered the game")
  // wRcon.run("env.time 9", 0) if message.includes("rust time")
  notification = function(type) {
    var message;
    message = `Something went wrong: ${type}`;
    console.log(message);
    return process.exit(1);
  };

}).call(this);

//# sourceMappingURL=main.js.map