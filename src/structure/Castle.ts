import { Player } from "./Player";


export class Castle {
  hp = 10_000;
  
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
}
