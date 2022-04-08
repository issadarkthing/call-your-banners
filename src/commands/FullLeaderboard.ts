import { Message, MessageEmbed, PermissionResolvable } from "discord.js";
import { Command } from "@jiman24/commandment";
import { client } from "..";

export default class extends Command {
  name = "fullleaderboard";
  description = "display all players and their coins (admin only)";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  private chunk<T>(arr: T[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  async exec(msg: Message) {

    const players = [...client.players
      .values()]
      .sort((a, b) => b.coins - a.coins)
      .map((x, i) => `${i + 1}. ${x.name} ${x.coins}`);

    const chunkedPlayers = this.chunk(players, 10);
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Full Leaderboard");

    for (const players of chunkedPlayers) {
      embed.setDescription("Name | Coins" + "\n" + players.join("\n"));
      this.sendEmbed(msg, embed);
    }
  }
}
