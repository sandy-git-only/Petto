// Load the AWS SDK for Node.js
import dotenv from 'dotenv';
dotenv.config();
import AWS from 'aws-sdk';

AWS.config.region = 'ap-northeast-1'
      const credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-northeast-1:220687070155',
      })
      const locationClient = new AWS.Location({
        credentials,
      })

// Set region
// AWS.config.update({region: 'REGION'});

const params = {
  TopicArn : process.env.TopicArn
}

// Create promise and SNS service object
var subslistPromise = new AWS.SNS({apiVersion: '2010-03-31'}).listSubscriptionsByTopic(params).promise();

// Handle promise's fulfilled/rejected states
  subslistPromise.then(
    function(data) {
      console.log(data);
    }).catch(
    function(err) {
      console.error(err, err.stack);
    }
  );
