import { client } from "..";
import { Player } from "./Player";

function createCastle(id: string, name: string) {
  const castle = new Castle(id, name);
  const data = client.castles.get(castle.id);

  if (!data) {
    castle.save();
  } else {
    Object.assign(castle, data);
  }

  return castle;
}

export interface Strike {
  playerID: string;
  damage: number;
}

export class Castle {
  static readonly INITIAL_HP = 10_000;
  static readonly MAX_HP = 15_000;
  static readonly MAX = 2;
  static readonly FORTIFY_COST = 100;
  static readonly BATTLE_COST = 5_000;
  static readonly FATAL_BLOW_REWARD = Math.round((Castle.BATTLE_COST * 2) * 0.1);
  static readonly GENERAL_REWARD = 5_000;
  hp = Castle.INITIAL_HP;
  
  coinsSpent = 0;
  generalID?: string;

  constructor(
    readonly id: string,
    readonly name: string,
  ) {}

  get general() {
    if (!this.generalID) return;
    return Player.fromID(this.generalID);
  }

  removeGeneral() {
    if (!this.general) return;

    this.general.role = "sword";
    this.general.save();

    delete this.generalID;
    this.save();
  }

  static get castleA() {
    return createCastle("north", "North");
  }

  static get castleB() {
    return createCastle("south", "South");
  }

  static fromName(name: string) {
    switch (name.toLowerCase()) {
      case Castle.castleA.name.toLowerCase(): return Castle.castleA;
      case Castle.castleB.name.toLowerCase(): return Castle.castleB;
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
