console.log("Emptying the bucket.");

require("dotenv").config();

let accessKeyId = process.env.AWS_ACCESS_KEY_ID
    , secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    , bucketRegion = process.env.AWS_BUCKET_REGION
    , bucketName = process.env.AWS_BUCKET_NAME
    , endpoint = process.env.ENDPOINT;

var AWS = require("aws-sdk");
AWS.config.setPromisesDependency(Promise);
AWS.config.update({
    endpoint,
    region: bucketRegion
    , credentials: new AWS.Credentials({
        accessKeyId
        , secretAccessKey
    })
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

s3.listObjects({ Bucket: bucketName }).promise().then((data) => {

    if (data.Contents.length <= 0) {
        console.log("Your bucket is already empty :)");
        return;
    }

    var objectKeys = [];

    for (let i = 0; i < data.Contents.length; i++) {
        objectKeys.push({
            Key: data.Contents[parseInt(i)].Key
        });
    }

    s3.deleteObjects({ Delete: { Objects: objectKeys }, Bucket: bucketName }).promise().then((data) => {
        console.log("Your bucket was emptied :)");
    }).catch((err) => {
        console.error(err.message);
        throw err;
    });
}).catch((err) => {
    console.error(err.message);
    throw err;
});
