import { client } from "..";
import { Player } from "./Player";

export class Castle {
  hp = 10_000;
  readonly id: string;
  static readonly MAX = 2;
  
  constructor(
    public name: string,
    public readonly generalID: string,
  ) {
    this.id = Castle.nameToID(name);
  }


  get general() {
    return Player.fromID(this.generalID);
  }

  static nameToID(name: string) {
    return name.toLowerCase().replace(/\s/g, "-");
  }

  static fromName(name: string) {
    return Castle.fromID(Castle.nameToID(name));
  }

  static fromID(id: string) {
    const data = client.castles.get(id) as Castle;
    return new Castle(data.name, data.generalID);
  }

  save() {
    client.castles.set(this.id, { ...this });
  }

  delete() {
    client.castles.delete(this.id);
  }
}
