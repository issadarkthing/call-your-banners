import { client } from "..";
import { Player } from "./Player";


export class Sword extends Player {
  COOLDOWN: number;
  constructor(id: string, name: string, role: "sword" | "general") {
    super(id, name, role);
    this.COOLDOWN = client.settings.swordsCooldown;
  }
}
