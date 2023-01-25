const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const pathHelper = require("../pathHelper");
const fileNames = require("../fileNames");

let keypairOutput;

module.exports.checkKeypair = async (opts, options) => {
    let id = opts.account.id || opts.email || "single-user";
    

    if (keypairOutput) {
        console.log("checkKeypair for %s from cache", id);
        return keypairOutput;
    }

    let key = pathHelper.accountsPath(options, id);

    console.log("request checkKeypair for", id);

    return s3.getObject({ Key: key, Bucket: options.bucketName }).promise().then((data) => {
        console.log("Successfully retrieved account keypair.");
        keypair = JSON.parse(data.Body.toString());
        keypairOutput = {
            privateKeyPem: keypair.privateKeyPem // string PEM private key
            , privateKeyJwk: keypair.privateKeyJwk // object JWK private key
        };

        return keypairOutput;
    }).catch((err) => {
        console.error("There was an error retrieving your account keypair:", err.message);
        return null;
    });
};