import { Command } from "@jiman24/commandment";
import { bold } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { client } from "..";
import { Castle } from "../structure/Castle";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "attack";
  description = "attack castle";

  async exec(msg: Message, args: string[]) {

    const castleName = args[0];

    if (!castleName) {
      throw new Error("you need to specify which castle");
    }

    const castle = Castle.fromName(castleName);
    const player = Player.fromID(msg.author.id);

    if (player.isOnCooldown()) {
      throw new Error(`Please wait for ${bold(player.timeLeft())}`);
    }

    const attack = player.attack();

    castle.hp -= attack;

    if (castle.hp > 0) {

      player.lastAttack = new Date();

      msg.channel.send(
        `${bold(player.name)} attacked ${bold(castleName)} for ${bold(attack)} damage!`
      );

    } else {


      msg.channel.send(`${bold(castleName)} has fallen!`);

      const otherCastle = client.castles.find(x => x.name !== castleName)[0]!;
      msg.channel.send(`${bold(otherCastle)} won the battle!`);


      // remove any player from general role
      client.players.forEach((val, id) => {
        client.players.set(id, { ...val, role: "sword", lastAttack: new Date(2000) });
      });

      // delete all castle
      client.castles.clear();
    }

    player.save();
    
  }
}
