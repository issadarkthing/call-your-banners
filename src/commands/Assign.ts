import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";
import { client } from "..";
import { Castle } from "../structure/Castle";
import { General } from "../structure/General";
import { Player } from "../structure/Player";

export default class extends Command {
  name = "assign";
  description = "assign player as General (admin only)";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message, args: string[]) {

    const mentionedMember = msg.mentions.members?.first();

    if (!mentionedMember) {
      throw new Error("you need to mention a user");
    }
    
    const castleName = args.slice(1).join(" ");

    if (!castleName) {
      throw new Error("you need to provide castle name");
    }

    const generalCount = client.players
      .reduce((acc, player) => player.role === "general" ? acc + 1 : acc, 0);

    if (generalCount >= General.MAX) {
      throw new Error(`there can only be ${General.MAX} Generals at one time`);
    }

    const player = Player.fromUser(mentionedMember.user);

    player.role = "general";


    if (client.castles.has(Castle.nameToID(castleName))) {
      throw new Error(`there is already a castle named ${castleName}`)
    }

    const castle = new Castle(castleName, player.id);
    
    player.save();
    castle.save();

    msg.channel.send(`Successfully set ${player.name} as General to ${castleName}`);

  }
}
