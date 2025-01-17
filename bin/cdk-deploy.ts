#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MainStack } from '../lib/main-stack';

const app = new cdk.App();
new MainStack(app, 'CdkDeployStack', {

  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  stackName: `${process.env.PROJECT}-${process.env.ENV}-stack`,
  description: "Deploy network infrastructure for the project",

});

cdk.Tags.of(app).add('project', process.env.PROJECT as string);
cdk.Tags.of(app).add('env', process.env.ENV as string);
cdk.Tags.of(app).add('owner', process.env.OWNER as string);
// cdk.Tags.of(app).add('rol', process.env.ROL as string);