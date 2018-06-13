const s3encrypt = require('node-s3-encryption-client');
const fs = require('fs');

const downloadAndDecrypt = (key, path, bucket) => {
  const params = {
    Bucket: bucket, 
    Key: key, 
  };
  return s3encrypt.getObject(params, (err, fileData) => {
    if(err){ throw err; }
    fs.writeFile(path, fileData.Body, function (err) {
        if (err) throw err;
        console.log('Successfully downloaded and decrypted: %s', path);
    });
  })
}

const encryptAndUpload = (key, path, kmsId, bucket) => {
  return fs.readFile(path, (err, stream) => {
    const params = {
      Body: stream,
      Bucket: bucket,
      Key: key,
      KmsParams: {
        KeyId: kmsId,
        KeySpec: 'AES_256'
      }
    }
    return s3encrypt.putObject(params, (err, success) => {
      if(err){ throw err; }
      console.log('Successfully encrypted and uploaded: %s', path);
    })
  })
}

module.exports = { downloadAndDecrypt, encryptAndUpload };