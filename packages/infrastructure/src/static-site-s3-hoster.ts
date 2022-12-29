import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export class StaticSiteS3Hoster extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const bucket = new s3.Bucket(this, 
            "StaticSiteS3HosterBucket", 
            {
                publicReadAccess: true,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                autoDeleteObjects: true, // allow delete bucket with objects
                websiteIndexDocument: "index.html",
            });

        new s3deploy.BucketDeployment(this, 
            "StaticSiteS3HosterDeployment",
            {
                sources: [s3deploy.Source.asset("../web/dist")],
                destinationBucket: bucket,
                retainOnDelete: false,
            });
    }
};