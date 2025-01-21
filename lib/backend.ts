import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

export interface backendProps {}

export class Backend extends Construct {
  constructor(scope: Construct, id: string, props: backendProps) {
    super(scope, id);

    // Creacion de VPC
    const vpc = new ec2.Vpc(this, "VPC", {
      // vpcName: 'VPC',
      ipAddresses: ec2.IpAddresses.cidr("10.10.0.0/16"),
      // natGateways: 1,
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
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
      restrictDefaultSecurityGroup: false,
    });

    // Creacion de SG para instacia Docker
    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      ec2.Peer.prefixList("pl-3b927c52"),
      ec2.Port.allTcp(),
      "Allow traffic from cloudfront"
    );

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

    //Creacion de instacia t3-medium
    const instancet3 = new ec2.Instance(this, "Instance-t3", {
      vpc: vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MEDIUM
      ),

      machineImage: ec2.MachineImage.genericLinux({
        "us-east-1": "ami-07fedd8f3ba615432",
      }),
      securityGroup: securityGroup,
      role: role,
      vpcSubnets: {
        subnets: vpc.publicSubnets,
      },
    });

    //Habilitar IP pública explícitamente (aunque ya se habilitó en la subnet)
    new cdk.CfnOutput(this, "InstancePublicIp-t3", {
      value: instancet3.instancePublicIp,
      description: "IP pública de la instancia EC2",
    });
  }
}
