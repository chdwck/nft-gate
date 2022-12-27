import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiLambdaFunction = new NodejsFunction(this, 'api-function', {
      bundling: {
        // mark these as external as we're not using them. they are optional plugins
        // for nestjs. if we decide to use them in the future, the corresponding
        // line will need to be removed from here.
        externalModules: [
          'cache-manager',
          '@nestjs/microservices',
          '@nestjs/websockets',
          'class-transformer/storage', // https://github.com/nestjs/mapped-types/issues/486
        ],
      },
      runtime: Runtime.NODEJS_16_X
    });
  }
}
