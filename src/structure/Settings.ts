import { client } from "..";


export class Settings {
  id = "main";
  generalCooldown = 3; // hours
  swordsCooldown = 7; // hours

  save() {
    client._settings.set(this.id, { ...this });
  }
}

