import { User } from "discord.js";
import { client } from "..";
import { General } from "./General";
import { Sword } from "./Sword";


export class Player {
  coins = 10_000;

  constructor(
    public readonly id: string,
    public name: string,
    public type: "general" | "sword",
  ) {}

  static fromID(id: string) {
    const data = client.players.get(id) as Player;
    let player: Player = new Sword(data.id, data.name, data.type);

    if (data.type === "general") {
      player = new General(data.id, data.name, data.type);
    }

    Object.assign(player, data);

    return player;
  }

  static fromUser(user: User) {
    return this.fromID(user.id);
  }

  save() {
    client.players.set(this.id, { ...this });
  }
}
