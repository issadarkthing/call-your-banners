import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";
import { client } from "..";
import { Stage } from "../structure/BattleStage";


export default class extends Command {
  name = "stage";
  description = "sets battle stage, there are 'ready', 'start', 'end'";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message, args: string[]) {

    const states = ["ready", "start", "end"];
    const state = args[0];

    if (!state) {
      throw new Error("you need to pass stage, 'ready', 'start', 'end'");
    } else if (!states.includes(state)) {
      throw new Error("invalid stage");
    }

    client.battleStage.stage = state as Stage;
    client.battleStage.save();

    msg.channel.send(`Successfully set stage to ${client.battleStage.stage}`);

  }
}
