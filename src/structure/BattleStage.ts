import { client } from "..";
import { Castle } from "./Castle";

/** 
 * There are 3 stages in this game:
 * ready - generals can fortify and players cannot attack and castle's hp reset
 * start - generals cannot fortify and players can attack
 * end - general cannot fortify and players cannot attack
 * */
export type Stage = "ready" | "start" | "end";

export class BattleStage {
  id = "main";
  stage: Stage = "ready";

  setReadyStage() {

    this.stage = "ready";
    this.save();

    // reset castle hp
    Castle.castleA.hp = Castle.INITIAL_HP;
    Castle.castleA.save();

    Castle.castleB.hp = Castle.INITIAL_HP;
    Castle.castleB.save();

    const castleAGeneral = Castle.castleA.general;
    const castleBGeneral = Castle.castleB.general;

    if (!castleAGeneral) {
      throw new Error("North Castle has not been assigned a general");
    } else if (!castleBGeneral) {
      throw new Error("South Castle has not been assigned a general");
    }

    castleAGeneral.coins -= Castle.BATTLE_COST;
    castleBGeneral.coins -= Castle.BATTLE_COST;

    castleAGeneral.save();
    castleBGeneral.save();
  }

  setStartStage() {
    this.stage = "start";
    this.save();
  }

  setEndStage() {
    this.stage = "end";
    this.save();

    const castleA = Castle.castleA;
    const castleB = Castle.castleB;

    const winnerCastle = castleA.hp > castleB.hp ? castleA : castleB;
    const loserCastle = castleA.hp < castleB.hp ? castleA : castleB;
    const winGeneral = winnerCastle.general;
    const loseGeneral = loserCastle.general;

    if (!winGeneral) {
      throw new Error(`${winGeneral} has not been assigned a general`);
    } else if (!loseGeneral) {
      throw new Error(`${loseGeneral} has not been assigned a general`);
    }

    winGeneral.coins += Castle.GENERAL_REWARD;
    winGeneral.save();

    loseGeneral.coins = 0;
    loseGeneral.save();
  }

  setStage(stage: Stage | string) {

    if (stage === this.stage) {
      throw new Error(`already in the ${this.stage} stage`);
    }

    switch (stage) {
      case "start": this.setStartStage(); break;
      case "ready": this.setReadyStage(); break;
      case "end": this.setEndStage(); break;
      default: throw new Error(`invalid stage "${stage}"`);
    }
  }

  save() {
    client._battleStage.set(this.id, { ...this });
  }
}
