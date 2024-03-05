import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, it } from '@std/testing/bdd';
import assert from 'node:assert';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      assert.strictEqual('Hello World!', appController.getHello());
    });
  });
});
