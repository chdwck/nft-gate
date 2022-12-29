@@ -1,28 +0,0 @@
import * as cdk from "@aws-cdk/core";
import * as amplify from "@aws-cdk/aws-amplify";

type AmplifyHosterProps = {
    githubOwner: string;
    githubRepo: string;
    githubOauthToken: cdk.SecretValue;
    packageRoot?: string;
};

export class AmplifyHoster extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: AmplifyHosterProps) {
        super(scope, id);

        const amplifyApp = new amplify.App(this, "amplify-hoster-app", {
            sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                owner: props.githubOwner,
                repository: props.githubRepo,
                oauthToken: props.githubOauthToken,
            })
        });

        // TODO: use lastest tag
        amplifyApp.addBranch('main');

        if (props.packageRoot) {
            amplifyApp.addEnvironment('AMPLIFY_MONOREPO_APP_ROOT', props.packageRoot);
        }

        // amplifyApp.addCustomRule(amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT);
    }
};