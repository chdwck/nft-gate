import * as cdk from "@aws-cdk/core";
import * as amplify from "@aws-cdk/aws-amplify";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export class AmplifyWeb extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const amplifyApp = new amplify.App(this, "nft-gate-web-app", {
            sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                owner: "chdwck",
                repository: "nft-gate",
                oauthToken: cdk.SecretValue.secretsManager(process.env.GITHUB_OAUTH_TOKEN_SECRET_ARN!, {
                    jsonField: 'GITHUB_OAUTH_TOKEN'
                })
            })
        });

        // TODO: use lastest tag
        const mainBranch = amplifyApp.addBranch('main');

        amplifyApp.addEnvironment('AMPLIFY_MONOREPO_APP_ROOT', 'packages/web');

        // amplifyApp.addCustomRule(amplify.

        amplifyApp.addCustomRule(amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT);
    }
};