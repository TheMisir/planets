import { Vector2 } from "./src/vector";
import { Game, Camera } from "./src/game";
import { Scene } from "./src/scene";
import { FPSMeter } from "./src/meter";
import { Planet } from "./src/planet";
import { Movement } from "./src/movement";

const randomBetween = (min: number, max: number) =>
  min + (max - min) * Math.random();

const scene = new Scene("#canvas");
const camera = new Camera(0.003);
const game = new Game(scene, camera);

const galaxySize = 500000;
const planetCount = 300;
const bigPlanetCount = randomBetween(3, 7);
const planetRadius = () => randomBetween(50, 500);
const planetMass = (radius: number) => radius * 100000;
const bigPlanetRadius = () => randomBetween(10000, 20000);

for (let i = 0; i < bigPlanetCount; i++) {
  const radius = bigPlanetRadius();

  game.add(
    new Planet(
      new Vector2(
        randomBetween(-galaxySize, galaxySize),
        randomBetween(-galaxySize, galaxySize)
      ),
      radius,
      planetMass(radius)
    )
  );
}

for (let i = 0; i < planetCount; i++) {
  const radius = planetRadius();

  game.add(
    new Planet(
      new Vector2(
        randomBetween(-galaxySize, galaxySize),
        randomBetween(-galaxySize, galaxySize)
      ),
      radius,
      planetMass(radius)
    )
  );
}

game.add(new FPSMeter());
game.add(new Movement(50, 0.01));
game.start();
