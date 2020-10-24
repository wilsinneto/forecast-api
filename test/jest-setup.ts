import supertest from 'supertest';
import { SetupServer } from './../src/server';

beforeAll(async () => {
  const server = new SetupServer();
  server.init();
  global.testRequest = supertest(server.getApp());
});
