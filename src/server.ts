import "./util/module-alias";
import { Server } from "@overnightjs/core";
import express, { Application } from "express";
import { ForecastController } from "./controllers/forecast";
import * as database from "@src/database";
import { BeachesController } from "./controllers/beaches";
import { UsersController } from "./controllers/users";

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
    const usersController = new UsersController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log("Server listening of port:", this.port);
    });
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }
}
