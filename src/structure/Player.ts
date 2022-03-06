import { random } from "@jiman24/discordjs-utils";
import { User } from "discord.js";
import { client } from "..";
import { General } from "./General";
import { Sword } from "./Sword";


export class Player {
  coins = 10_000;
  minAttack = 50;
  maxAttack = 100;

  constructor(
    public readonly id: string,
    public name: string,
    public role: "general" | "sword",
  ) {}

  static fromID(id: string) {
    const data = client.players.get(id) as Player;
    let player: Player = new Sword(data.id, data.name, data.role);

    if (data.role === "general") {
      player = new General(data.id, data.name, data.role);
    }

    Object.assign(player, data);

    return player;
  }

  static fromUser(user: User) {
    return this.fromID(user.id);
  }

  attack() {
    return random.integer(this.minAttack, this.maxAttack);
  }

  save() {
    client.players.set(this.id, { ...this });
  }
}
