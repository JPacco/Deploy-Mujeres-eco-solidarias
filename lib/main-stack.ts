import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { Backend } from "./backend";
// import { CfnParameter } from "aws-cdk-lib";

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Backend(this, "Backend", {});
  }
}
