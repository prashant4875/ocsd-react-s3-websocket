import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import {BucketDeployment, Source} from 'aws-cdk-lib/aws-s3-deployment';
import {AllowedMethods, CloudFrontAllowedMethods, Distribution, OriginAccessIdentity, OriginSslPolicy, CloudFrontWebDistribution, ViewerProtocolPolicy, PriceClass} from "aws-cdk-lib/aws-cloudfront";
import {HttpOrigin, S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import * as path from "path";
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
// import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';


// import * as wafv2 from 'aws-cdk-lib/aws-wafv2'

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps,) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'MyBucket', {
      bucketName: 'ocsd-demo-personal-carts-3',
    });

    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: bucket,
      sources: [Source.asset(path.resolve(__dirname, '../dist/my-app/build'))]
    })


    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    bucket.grantRead(originAccessIdentity);


    // const cloudfrontDistribution = new CloudFrontWebDistribution(
    //   this,
    //   "MyDistribution",
    //   {
    //     comment: "CDN for Web App",
    //     defaultRootObject: "index.html",
    //     viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //     priceClass: PriceClass.PRICE_CLASS_ALL,
    //     originConfigs: [
    //       {
    //         // make sure your backend origin is first in the originConfigs list so it takes precedence over the S3 origin
    //         customOriginSource: {
    //           domainName: `losrwhslxl.execute-api.ap-southeast-2.amazonaws.com`
    //         },
    //         behaviors: [
    //           {
    //             pathPattern: "/*", // CloudFront will forward `/api/*` to the backend so make sure all your routes are prepended with `/api/`
    //             allowedMethods: CloudFrontAllowedMethods.ALL,
    //             // defaultTtl: Duration.seconds(0),
    //             forwardedValues: {
    //             queryString: true,
    //             headers: ["Authorization"] // By default CloudFront will not forward any headers through so if your API needs authentication make sure you forward auth headers across
    //             },
    //           },
    //         ],
    //       },
    //       {
    //         s3OriginSource: {
    //           s3BucketSource: bucket,
    //           originAccessIdentity: originAccessIdentity,
    //         },
    //         behaviors: [
    //           {
    //             compress: true,
    //             isDefaultBehavior: true,
    //             // defaultTtl: Duration.seconds(0),
    //             allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
    //           }
    //           ,
    //         ],
    //       },
    //     ]
    //   })


    new Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(bucket, {originAccessIdentity}),
      },
      additionalBehaviors: {'/dev':{origin: new HttpOrigin('losrwhslxl.execute-api.ap-southeast-2.amazonaws.com'),
      allowedMethods: AllowedMethods.ALLOW_ALL
      }
      
      
      }
      
    })

    // const cfnIPSet = new wafv2.CfnIPSet(this, 'MyCfnIPSet', {
    //   addresses: ['10.0.0.0/32'],
    //   ipAddressVersion: 'IPV4',
    //   scope: 'REGIONAL' ,
    //   description: 'ocsd-demo',
    //   name: 'ocsd-ipsets'
    // });

    // const cfnWebACL = new wafv2.CfnWebACL(this, 'MyCfnWebACL', {
    //   description: 'description',
    //   name: 'name'
    // });
      

    

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'HelloCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
