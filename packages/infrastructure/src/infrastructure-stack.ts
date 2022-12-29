import * as cdk from "@aws-cdk/core";
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Runtime } from '@aws-cdk/aws-lambda';

import { StaticSiteS3Hoster } from './static-site-s3-hoster';

export class InfrastructureStack extends cdk.Stack {
  public readonly apiEndpoint: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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
          'class-validator',
          'class-transformer', // https://github.com/nestjs/mapped-types/issues/486
        ],
      },
      runtime: Runtime.NODEJS_16_X
    });

    const restApiGateway = new LambdaRestApi(this, 'api-function-gateway', {
      handler: apiLambdaFunction,
    });

    this.apiEndpoint = new cdk.CfnOutput(this, 'GatewayURL', {
      value: restApiGateway.url
    })

    new StaticSiteS3Hoster(this, 'amplify-web');
  }
}
