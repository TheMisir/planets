import { Vector2 } from "./src/vector";
import { Game, Camera } from "./src/game";
import { Scene } from "./src/scene";
import { FPSMeter } from "./src/meter";
import { Planet } from "./src/planet";
import { Movement } from "./src/movement";

function randomBetween(min: number, max: number) {
  return min + (max - min) * Math.random();
}

const scene = new Scene("#canvas");
const camera = new Camera(0.003);
const game = new Game(scene, camera);

const galaxySize = 500000;
const planetCount = 300;
const planetRadius = () => randomBetween(50, 500);
const planetMass = () => randomBetween(50, 500) * 100000;

for (let i = 0; i < planetCount; i++) {
  game.add(
    new Planet(
      new Vector2(
        randomBetween(-galaxySize, galaxySize),
        randomBetween(-galaxySize, galaxySize)
      ),
      planetRadius(),
      planetMass()
    )
  );
}

game.add(new FPSMeter());
game.add(new Movement(50, 0.01));

game.start();

let downAt: number;

document.onmousedown = () => {
  downAt = Date.now();
};

document.onmouseup = (event) => {
  const radius = Math.max(20, Math.min(500, (Date.now() - downAt) / 10));

  game.add(
    new Planet(
      camera.screenToWorld(new Vector2(event.pageX, event.pageY)),
      radius,
      radius * 10000
    )
  );
};
