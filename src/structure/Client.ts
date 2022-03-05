import { CommandManager } from "@jiman24/commandment";
import { Client as DiscordClient } from "discord.js";

export class Client extends DiscordClient {
  commandManager = new CommandManager(process.env.PREFIX || "!");
}
