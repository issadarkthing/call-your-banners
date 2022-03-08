import { TextBasedChannel } from "discord.js";
import Enmap from "enmap";
import { client } from "..";
import { Castle } from "./Castle";
import { Player } from "./Player";

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
  private static db = new Enmap("battle_stage");

  constructor() {
    const data = BattleStage.db.get(this.id);
    Object.assign(this, data);
  }

  setReadyStage(channel: TextBasedChannel) {

    this.stage = "ready";
    this.save();

    channel.send(`Generals now may fortify their castle`);
    channel.send(`All castles cannot be attacked at this stage`);

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

    castleAGeneral.coins += Castle.BATTLE_COST;
    castleBGeneral.coins += Castle.BATTLE_COST;

    const giveMessage = (player: Player) => {
      channel.send(`Gave ${Castle.BATTLE_COST} coins to ${player.name}`);
    }

    giveMessage(castleAGeneral);
    giveMessage(castleBGeneral);

    castleAGeneral.save();
    castleBGeneral.save();
  }

  setStartStage(channel: TextBasedChannel) {
    this.stage = "start";
    this.save();

    channel.send(`Generals can no longer fortify castle`);
    channel.send(`Swords and Generals now may attack castle`);
  }

  setEndStage(channel: TextBasedChannel) {
    this.stage = "end";
    this.save();
    
    channel.send(`All castles cannot be attacked at this stage`);

    const castleA = Castle.castleA;
    const castleB = Castle.castleB;

    if (castleA.hp === castleB.hp) {
      throw new Error("Both castle has the same hp. No winner");
    }

    const winnerCastle = castleA.hp > castleB.hp ? castleA : castleB;
    const loserCastle = castleA.hp < castleB.hp ? castleA : castleB;
    const winGeneral = winnerCastle.general;
    const loseGeneral = loserCastle.general;

    if (!winGeneral) {
      throw new Error(`${winGeneral} has not been assigned a general`);
    } else if (!loseGeneral) {
      throw new Error(`${loseGeneral} has not been assigned a general`);
    }

    channel.send(`${winnerCastle.name} Castle wins!`);

    winGeneral.coins += Castle.GENERAL_REWARD;
    winGeneral.role = "sword";
    winGeneral.save();
    channel.send(`${winGeneral.name} received ${Castle.GENERAL_REWARD} coins`);

    delete castleA.generalID;
    castleA.save();

    const coinsTaken = Castle.BATTLE_COST - loserCastle.coinsSpent;
    loseGeneral.coins = loseGeneral.coins < coinsTaken ? 0 : loseGeneral.coins - coinsTaken;
    loseGeneral.role = "sword";
    loseGeneral.save();
    channel.send(`All ${winGeneral.name}'s coins has been taken away`);

    delete castleB.generalID;
    castleB.save();

    // reset players last attack
    client.players.forEach((val, id) => {
      client.players.set(id, { ...val, lastAttack: new Date(2000) });
    });

  }

  setStage(channel: TextBasedChannel, stage: Stage | string) {

    if (stage === this.stage) {
      throw new Error(`already in the ${this.stage} stage`);
    }

    switch (stage) {
      case "start": this.setStartStage(channel); break;
      case "ready": this.setReadyStage(channel); break;
      case "end": this.setEndStage(channel); break;
      default: throw new Error(`invalid stage "${stage}"`);
    }
  }

  save() {
    BattleStage.db.set(this.id, { ...this });
  }
}
