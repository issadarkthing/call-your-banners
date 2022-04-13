import { Castle } from "./structure/Castle";

function resetCastle(castle: Castle) {
  const newCastle = new Castle(castle.id, castle.name);
  newCastle.save();
}

resetCastle(Castle.castleA);
resetCastle(Castle.castleB);

console.log("reset succesfully");

process.exit(0);
