import { Command } from "@jiman24/commandment";
import { bold } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { Player } from "../structure/Player";

export default class extends Command {
  name = "ranking";
  description = "show your role";

  async exec(msg: Message) {

    const player = Player.fromUser(msg.author);
    msg.channel.send(`Your role is ${bold(player.role)}`);
  }
}
