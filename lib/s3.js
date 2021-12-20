// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var proxy = require('proxy-agent');
// Set the region 

module.exports = () => {
  const listBuckets = async function () {
    AWS.config.update({region: 'ap-southeast-2'});
    AWS.config.update({
        httpOptions: { agent: proxy('http://proxy.au.eds.com:8080') }
      });
    var params = {
    };
    return new Promise((resolve, reject) => {
        console.log('pre list buckets')
        s3.listBuckets(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            return reject(err)
          }
          else{
            console.log(data)
            return resolve(data) // successful response
          }
        });
    });
  }

  return {
    listBuckets
  }
}

