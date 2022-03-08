import { client } from "..";


export class Settings {
  id = "main";
  generalCooldown = 7; // hours
  swordsCooldown = 2; // hours

  save() {
    client._settings.set(this.id, { ...this });
  }
}

