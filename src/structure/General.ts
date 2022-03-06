import { time } from "@jiman24/discordjs-utils";
import { Player } from "./Player";

export class General extends Player {
  static readonly MAX = 2;
  static readonly COOLDOWN = time.HOUR * 3;
}
