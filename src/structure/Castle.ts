import { client } from "..";
import { Player } from "./Player";

function createCastle(id: string, name: string) {
  const castle = new Castle(id, name);
  const data = client.castles.get(castle.id);

  if (!data) {
    castle.save();
  }

  Object.assign(castle, data);
  return castle;
}

export class Castle {
  hp = 10_000;
  static readonly MAX_HP = 15_000;
  static readonly MAX = 2;
  static readonly FORTIFY_COST = 100;
  
  generalID?: string;

  constructor(
    readonly id: string,
    readonly name: string,
  ) {}

  get general() {
    if (!this.generalID) return;
    return Player.fromID(this.generalID);
  }

  static get castleA() {
    return createCastle("north", "North");
  }

  static get castleB() {
    return createCastle("south", "South");
  }

  static fromName(name: string) {
    switch (name.toLowerCase()) {
      case Castle.castleA.name: return Castle.castleA;
      case Castle.castleB.name: return Castle.castleB;
      default: throw new Error("cannot find castle");
    }
  }

  save() {
    client.castles.set(this.id, { ...this });
  }

  delete() {
    client.castles.delete(this.id);
  }
}
