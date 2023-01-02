import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { DockerImageAsset } from "@aws-cdk/aws-ecr-assets";

const APP_PORT = 3000;

type FargateHosterProps = {
    webPackageName: string; // Must reference a dockerFile in /fargate-hoster-images,
    environment?: { [key: string]: string };
};

export class FargateHoster extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: FargateHosterProps) {
        super(scope, id);

        const vpc = new ec2.Vpc(this, `${id}-fargate-hoster-vpc`, { maxAzs: 2 });

        const taskDefinition = new ecs.FargateTaskDefinition(this, `${id}-fargate-hoster-task-definition`, {
            memoryLimitMiB: 512,
            cpu: 256,
        });

        const dockerFile = new DockerImageAsset(this, `${id}-fargate-hoster-docker-image-asset`, {
            directory: `../../node_modules/${props.webPackageName}`,
            file: 'Dockerfile',
        });

        const image = ecs.ContainerImage.fromDockerImageAsset(dockerFile);

        const container = taskDefinition.addContainer(`${id}-fargate-hoster-container`, {
            image,
            logging: ecs.LogDrivers.awsLogs({ streamPrefix: `${id}-fargate-hoster-container` }),
            environment: props.environment,
        });

        container.addPortMappings({ containerPort: APP_PORT });

        const cluster = new ecs.Cluster(this, `${id}-fargate-hoster-cluster`, { clusterName: 'fargate-hoster-cluster', vpc });

        const securityGroup = new ec2.SecurityGroup(this, `${id}-fargate-hoster-security-group`, {
            vpc,
            allowAllOutbound: true,
        });

        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(APP_PORT), 'Allow inbound HTTP');

        const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'fargate-hoster-fargate-service', {
            cluster,
            publicLoadBalancer: true,
            cpu: 256,
            desiredCount: 1,
            memoryLimitMiB: 512,
            taskDefinition,
            securityGroups: [securityGroup]
        });

        const scalableTarget = fargateService.service.autoScaleTaskCount({
            minCapacity: 1,
            maxCapacity: 2
          })
      
          scalableTarget.scaleOnCpuUtilization('cpuScaling', {
            targetUtilizationPercent: 70
          })
    }
};