import { NestFactory } from '@nestjs/core';
import { Handler } from 'aws-lambda';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import { AppModule } from './app/app.module';

let serverlessExpressInstance: Handler;

const setup: Handler = async (event, context, callback) => {
  const app = express();

  const nestApp = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(app),
  );

  await nestApp.init();

  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context, callback);
};

export const handler: Handler = async (event, context, callback) => {
  if (serverlessExpressInstance) {
    return serverlessExpressInstance(event, context, callback);
  }

  return setup(event, context, callback);
};
