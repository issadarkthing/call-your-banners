import { Message, MessageEmbed } from "discord.js";
import { Command } from "@jiman24/commandment";
import { client } from "..";

export default class extends Command {
  name = "stats";
  description = "full list of players ranked based on the total strikes dealt";

  private chunk<T>(arr: T[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  async exec(msg: Message) {

    const players = [...client.players.values()]
      .sort((a, b) => b.strikeCount - a.strikeCount)
      .map((x, i) => `${i + 1}. ${x.name} ${x.strikeCount || 0}`);

    const chunkedPlayers = this.chunk(players, 10);
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Full Leaderboard");

    for (const players of chunkedPlayers) {
      embed.setDescription("Name | Total Strikes" + "\n" + players.join("\n"));
      this.sendEmbed(msg, embed);
    }
  }
}
