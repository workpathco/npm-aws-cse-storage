const s3encrypt = require('node-s3-encryption-client');
const homedir = require('homedir');
const fs = require('fs');

const downloadAndDecrypt = (key, path, bucket) => {
  if(path.indexOf('~') > -1){
    path = path.replace('~', homedir()) 
  }
  const params = {
    Bucket: bucket, 
    Key: key, 
  };
  return s3encrypt.getObject(params, (err, fileData) => {
    if(err) throw err;
    fs.writeFile(path, fileData.Body, (err) => {
      if(err) throw err;
      console.log('Successfully downloaded and decrypted: %s', path);
    });
  })
}

const encryptAndUpload = (key, path, kmsId, bucket) => {
  if(path.indexOf('~') > -1){
    path = path.replace('~', homedir()) 
    console.log(path);
  }
  return fs.readFile(path, (err, stream) => {
    if(err) throw err;
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
      if(err) throw err;
      console.log('Successfully encrypted and uploaded: %s', path);
    })
  })
}

module.exports = { downloadAndDecrypt, encryptAndUpload };
