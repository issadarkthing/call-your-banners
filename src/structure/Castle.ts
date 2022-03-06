import { client } from "..";
import { Player } from "./Player";


export class Castle {
  hp = 10_000;
  static readonly MAX = 2;
  
  constructor(
    public name: string,
    public readonly generalID: string,
  ) {}

  get id() {
    return this.name.toLowerCase().replace(" ", "-");
  }

  get general() {
    return Player.fromID(this.generalID);
  }

  save() {
    client.castles.set(this.id, { ...this });
  }

  delete() {
    client.castles.delete(this.id);
  }
}
