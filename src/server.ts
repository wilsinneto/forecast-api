import "./util/module-alias";
import { Server } from "@overnightjs/core";
import express, { Application } from "express";
import { ForecastController } from "./controllers/forecast";
import * as database from "@src/database";
import { BeachesController } from "./controllers/beaches";

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  public getApp(): Application {
    return this.app;
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    this.addControllers([forecastController, beachesController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }
}
