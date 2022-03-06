import { random } from "@jiman24/discordjs-utils";
import { User } from "discord.js";
import { DateTime } from "luxon";
import { client } from "..";


export abstract class Player {
  coins = 10_000;
  minAttack = 50;
  maxAttack = 100;
  lastAttack = new Date(2000);
  abstract COOLDOWN: number;

  constructor(
    public readonly id: string,
    public name: string,
    public role: "general" | "sword",
  ) {}

  static fromUser(user: User) {
    const { Sword } = require("./Sword");
    return Player.fromID(user.id) || new Sword(user.id, user.username, "sword");
  }

  static fromID(id: string) {
    const { General } = require("./General");
    const { Sword } = require("./Sword");

    const data = client.players.get(id);

    if (!data) return;

    let player: Player = new Sword(id, "", "sword");

    if (data.role === "general") {
      player = new General(data.id, data.name, data.role);
    }

    Object.assign(player, data);


    return player;
  }

  isOnCooldown() {
    const lastAttack = DateTime.fromJSDate(this.lastAttack);
    const diff = Math.abs(lastAttack.diffNow(["hours"]).hours);

    return diff < this.COOLDOWN;
  }

  timeLeft() {
    const lastAttack = DateTime.fromJSDate(this.lastAttack).plus({ hours: this.COOLDOWN });
    const { hours, minutes, seconds } = lastAttack.diffNow(["hours", "minutes", "seconds"]);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  attack() {
    return random.integer(this.minAttack, this.maxAttack);
  }

  save() {
    client.players.set(this.id, { ...this });
  }
}
