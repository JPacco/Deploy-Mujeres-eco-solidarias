import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { backend } from './backend';
// import { CfnParameter } from "aws-cdk-lib";


export class MainStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // const machineImage = new CfnParameter(this, 'machineImage', {
        //     type: 'String',
        //     description: 'The machine image to use',
        //     default: 'ami-0c02fb55956c7d316',
        // });

        new backend(this, 'backend',);

    }
}