import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

export class backend extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creacion de VPC
    const vpc = new ec2.Vpc(this, "VPC", {
      // vpcName: 'VPC',
      ipAddresses: ec2.IpAddresses.cidr("10.10.0.0/16"),
      natGateways: 1,
      availabilityZones: ["us-east-1a", "us-east-1b"],
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "Private",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
      restrictDefaultSecurityGroup: false,
    });

    // Creacion de SG para instacia Docker
    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
    });

    //Creacion de Rol
    const role = new iam.Role(this, "Role", {
      roleName: "ec2-ssm-role-stack",
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "CloudWatchAgentServerPolicy"
        ),
      ],
    });

    // Creacion de instacia
    const instance = new ec2.Instance(this, "Instance", {
      vpc: vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
      }),
      securityGroup: securityGroup,
      role: role,
      vpcSubnets: {
        subnets: vpc.publicSubnets,
      },
    });

    // Habilitar IP pública explícitamente (aunque ya se habilitó en la subnet)
    new cdk.CfnOutput(this, "InstancePublicIp", {
      value: instance.instancePublicIp,
      description: "IP pública de la instancia EC2",
    });
  }
}
