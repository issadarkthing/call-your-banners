import { CommandManager } from "@jiman24/commandment";
import { Client as DiscordClient } from "discord.js";
import type { ClientOptions } from "discord.js";
import Enmap from "enmap";
import { BattleStage } from "./BattleStage";

export class Client extends DiscordClient {
  commandManager = new CommandManager(process.env.PREFIX || "!");
  players = new Enmap("player");
  castles = new Enmap("castle");
  _battleStage = new Enmap("battle_status");
  battleStage: BattleStage;

  constructor(options: ClientOptions) {
    super(options);
    this.battleStage = new BattleStage();
  }
}
