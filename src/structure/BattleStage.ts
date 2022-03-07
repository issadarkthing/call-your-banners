import { client } from "..";

export type Stage = "ready" | "start" | "end";

export class BattleStage {
  id = "main";
  stage: Stage = "ready";

  save() {
    client._battleStage.set(this.id, { ...this });
  }
}
