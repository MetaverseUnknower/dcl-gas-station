import * as utils from "@dcl/ecs-scene-utils";

const GAS_STATION_API_URL = "https://gasstation-mainnet.matic.network";
const GAS_UPDATE_INTERVAL_MS = 10000;

export class GasStation {
  textEntities: Entity[] = [new Entity(), new Entity(), new Entity()];
  slowGasPrice: number = 0;
  standardGasPrice: number = 0;
  fastGasPrice: number = 0;
  averageGasPrice: number = 0;

  constructor() {
    log("creating gas station");
    this.createSign();
    this.createSignText();

    // Create a text entity for each gas price
    this.createPriceText();

    log(this.textEntities);
    this.updateGasPrice();

    // Schedule recurring updateGasPrice function
    const interval = new utils.Interval(GAS_UPDATE_INTERVAL_MS, this.updateGasPrice);
    this.textEntities[0].addComponent(interval);
  }
  createSign() {
    const entities = [new Entity(), new Entity(), new Entity(), new Entity(), new Entity()];

    const nameSegment = new BoxShape(),
      topMat = new Material();
    topMat.albedoColor = new Color3(2, 3, 4);
    entities[0].addComponent(topMat);
    entities[0].addComponent(nameSegment);
    entities[0].addComponent(
      new Transform({
        position: new Vector3(4, 10, 15),
        scale: new Vector3(7, 1.75, 0.5),
      })
    );

    engine.addEntity(entities[0]);
    const slowGasSegment = new BoxShape(),
      slowMat = new Material();
    slowMat.albedoColor = new Color3(2.5, 1.5, 2);
    entities[1].addComponent(slowMat);
    entities[1].addComponent(slowGasSegment);
    entities[1].addComponent(
      new Transform({
        position: new Vector3(4, 8, 15),
        scale: new Vector3(7, 1.75, 0.5),
      })
    );
    engine.addEntity(entities[1]);

    const standardGasSegment = new BoxShape(),
      standardMat = new Material();
    standardMat.albedoColor = new Color3(1.5, 2, 2.5);
    entities[2].addComponent(standardMat);
    entities[2].addComponent(standardGasSegment);
    entities[2].addComponent(
      new Transform({
        position: new Vector3(4, 6, 15),
        scale: new Vector3(7, 1.75, 0.5),
      })
    );
    engine.addEntity(entities[2]);

    const fastGasSegment = new BoxShape(),
      fastMat = new Material();
    fastMat.albedoColor = new Color3(2, 2.5, 1.5);
    entities[3].addComponent(fastMat);
    entities[3].addComponent(fastGasSegment);
    entities[3].addComponent(
      new Transform({
        position: new Vector3(4, 4, 15),
        scale: new Vector3(7, 1.75, 0.5),
      })
    );
    engine.addEntity(entities[3]);

    const pole = new CylinderShape();
    const mat = new Material();
    mat.albedoColor = Color3.Black();
    entities[4].addComponent(pole);
    entities[4].addComponent(mat);
    entities[4].addComponent(
      new Transform({
        position: new Vector3(4, 5, 15),
        scale: new Vector3(0.2, 5, 0.2),
      })
    );
    engine.addEntity(entities[4]);
  }

  createSignText() {
    const entities = [new Entity(), new Entity(), new Entity(), new Entity()];

    const name = new TextShape();
    name.fontSize = 13;
    name.value = "UNKNOCO";
    name.hTextAlign = "center";
    name.color = Color3.Black();
    entities[0].addComponent(name);
    entities[0].addComponent(
      new Transform({
        position: new Vector3(4, 10, 14.7),
      })
    );
    engine.addEntity(entities[0]);

    const slowGasText = new TextShape();
    slowGasText.fontSize = 4;
    slowGasText.value = "SLOW";
    slowGasText.hTextAlign = "left";
    slowGasText.color = Color3.Black();
    entities[1].addComponent(slowGasText);
    entities[1].addComponent(
      new Transform({
        position: new Vector3(0.65, 8.5, 14.7),
      })
    );
    engine.addEntity(entities[1]);

    const standardGasText = new TextShape();
    standardGasText.fontSize = 4;
    standardGasText.value = "STANDARD";
    standardGasText.hTextAlign = "left";
    standardGasText.color = Color3.Black();
    entities[2].addComponent(standardGasText);
    entities[2].addComponent(
      new Transform({
        position: new Vector3(0.65, 6.5, 14.7),
      })
    );
    engine.addEntity(entities[2]);

    const fastGasText = new TextShape();
    fastGasText.fontSize = 4;
    fastGasText.value = "FAST";
    fastGasText.hTextAlign = "left";
    fastGasText.color = Color3.Black();
    entities[3].addComponent(fastGasText);
    entities[3].addComponent(
      new Transform({
        position: new Vector3(0.65, 4.5, 14.7),
      })
    );
    engine.addEntity(entities[3]);
  }

  createPriceText() {
    const slowGasPriceText = new TextShape();
    slowGasPriceText.fontSize = 14;
    slowGasPriceText.value = "0000.0";
    slowGasPriceText.color = Color3.Black();
    slowGasPriceText.hTextAlign = "right";
    this.textEntities[0].addComponent(slowGasPriceText);
    this.textEntities[0].addComponent(
      new Transform({
        position: new Vector3(7.25, 8, 14.7),
      })
    );
    engine.addEntity(this.textEntities[0]);

    const standardGasPriceText = new TextShape();
    standardGasPriceText.fontSize = 14;
    standardGasPriceText.value = "0000.0";
    standardGasPriceText.color = Color3.Black();
    standardGasPriceText.hTextAlign = "right";
    this.textEntities[1].addComponent(standardGasPriceText);
    this.textEntities[1].addComponent(
      new Transform({
        position: new Vector3(7.25, 6, 14.7),
      })
    );
    engine.addEntity(this.textEntities[1]);

    const fastGasPriceText = new TextShape();
    fastGasPriceText.fontSize = 14;
    fastGasPriceText.value = "0000.0";
    fastGasPriceText.color = Color3.Black();
    fastGasPriceText.hTextAlign = "right";
    this.textEntities[2].addComponent(fastGasPriceText);
    this.textEntities[2].addComponent(
      new Transform({
        position: new Vector3(7.25, 4, 14.7),
      })
    );
    engine.addEntity(this.textEntities[2]);
  }

  async updateGasPrice() {
    log("getting gas prices");
    log(this.textEntities);
    try {
      // Fetch gas price data from Gas Station API
      const response = await fetch(GAS_STATION_API_URL);
      const data = await response.json();

      // Extract gas prices in Gwei
      const slowGasPrice = data?.safeLow ?? 0;
      const standardGasPrice = data?.standard ?? 0;
      const fastGasPrice = data?.fast ?? 0;

      // Update gas prices if they have changed
      if (this.slowGasPrice !== slowGasPrice || this.standardGasPrice !== standardGasPrice || this.fastGasPrice !== fastGasPrice) {
        this.slowGasPrice = slowGasPrice;
        this.standardGasPrice = standardGasPrice;
        this.fastGasPrice = fastGasPrice;

        this.textEntities[0].getComponent(TextShape).value = `${slowGasPrice}`;
        this.textEntities[1].getComponent(TextShape).value = `${standardGasPrice}`;
        this.textEntities[2].getComponent(TextShape).value = `${fastGasPrice} `;
      }
    } catch (error) {
      log(error);
    }
  }
}
