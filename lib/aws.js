const AWS = require("aws-sdk");
AWS.config.setPromisesDependency(Promise);

module.exports = (options) => {
    AWS.config.update({
        endpoint: options.endpoint,
        region: options.bucketRegion
        , credentials: new AWS.Credentials({
            accessKeyId: options.accessKeyId
            , secretAccessKey: options.secretAccessKey
        })
    });
}
