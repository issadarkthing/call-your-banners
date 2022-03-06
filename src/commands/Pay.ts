import { Command } from "@jiman24/commandment";
import { bold } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { Player } from "../structure/Player";

export default class extends Command {
  name = "pay";
  description = "give coins to other players";

  async exec(msg: Message, args: string[]) {

    const player = Player.fromUser(msg.author);
    const amountStr = args[1];
    const amount = parseInt(amountStr);
    const mentionedMember = msg.mentions.members?.first();

    if (!args[0] || !mentionedMember) {
      throw new Error("please mention a member");
    } else if (!amountStr) {
      throw new Error("please give amount")
    } else if (Number.isNaN(amount)) {
      throw new Error("please gve valid amount");
    } else if (amount > player.coins) {
      throw new Error("insufficient amount");
    } else if (player.role !== "general") {
      throw new Error("only general can give pay");
    }

    const receiver = Player.fromID(mentionedMember.id);

    player.coins -= amount;
    receiver.coins += amount;

    player.save();
    receiver.save();

    msg.channel.send(`Successfully gave ${receiver.name} ${bold(amount)} coins`);

  }
}