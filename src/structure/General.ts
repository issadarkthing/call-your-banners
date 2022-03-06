import { Player } from "./Player";

export class General extends Player {
  static readonly MAX = 2;
  COOLDOWN: number;
  constructor(id: string, name: string, role: "general" | "sword" ) {
    super(id, name, role);
    this.COOLDOWN = 3;
  }
}
