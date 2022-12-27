import * as cdk from "@aws-cdk/core";
import * as codecommit from "@aws-cdk/aws-codecommit";
import * as amplify from "@aws-cdk/aws-amplify";

export class AmplifyWebStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const amplifyApp = new amplify.App(this, "nft-gate-web-app", {
            sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                owner: "chdwck",
                repository: "nft-gate",
                oauthToken: cdk.SecretValue.secretsManager("NFT_GATE_GH_OAUTH_TOKEN", {
                    jsonField: process.env.GITHUB_OAUTH_TOKEN_SECRET_ARN,
                })
            })
        });

        // TODO: use lastest tag
        const lastestTag = amplifyApp.addBranch('main');
    }
};