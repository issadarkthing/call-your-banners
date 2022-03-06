import { time } from "@jiman24/discordjs-utils";
import { Player } from "./Player";


export class Sword extends Player {
  static COOLDOWN = time.HOUR * 8;
}
