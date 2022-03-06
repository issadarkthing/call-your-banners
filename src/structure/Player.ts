import { User } from "discord.js";
import { client } from "..";
import { General } from "./General";
import { Sword } from "./Sword";


export class Player {
  coins = 10000;

  constructor(
    public readonly id: string,
    public name: string,
    public type: "general" | "sword",
  ) {}

  fromUser(user: User) {
    const data = client.players.get(user.id) as Player;
    let player: Player = new Sword(data.id, data.name, data.type);

    if (data.type === "general") {
      player = new General(data.id, data.name, data.type);
    }

    Object.assign(player, data);

    return player;
  }

  save() {
    client.players.set(this.id, { ...this });
  }
}
