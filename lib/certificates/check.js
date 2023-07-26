const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const pathHelper = require("../pathHelper");
const fileNames = require("../fileNames");
const cache = require("../cache")();

const getPaths = (opts, options, id) => {
    return [
        pathHelper.certificatesPath(options, id, fileNames.privkey.pem)
        , pathHelper.certificatesPath(options, id, fileNames.cert)
        , pathHelper.certificatesPath(options, id, fileNames.chain)
    ]
};

const getPromises = (options, paths) => {
    let promises = [];

    for (let i = 0; i < paths.length; i++) {
        const key = paths[i];
        const promise = s3.getObject({ Key: key, Bucket: options.bucketName }).promise().then((data) => {
            console.log("Successfully retrieved certificate", key);
            return data.Body.toString();
        }).catch((err) => {
            console.error("There was an error retrieving your certificate", key);
            throw err;
        })
        promises.push(promise);
    }

    return promises;
}

module.exports.check = (opts, options) => {
    const id = opts.certificate && opts.certificate.id || opts.subject;
    console.log("certificates.check for", opts.subject);

    if (cache.has(id)) return Promise.resolve([cache.get(id)])

    const paths = getPaths(opts, options, id);
    const promises = getPromises(options, paths);

    return Promise.all(promises).then((values) => {
        const res = {
            privkey: values[0]
            , cert: values[1]
            , chain: values[2]
        }

        cache.set(id, res);
        return res;
    }).catch((err) => {
        console.error("There was an error checking the certificates:", err.message);
        return null;
    });
};
