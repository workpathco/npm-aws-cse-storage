// Tmp
const readJson = require('read-package-json');
const factory = require('./factory.js');


if(!process.env.AWS_PROFILE && !process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_KEY_SECRET){
  throw new Error("You must include your aws profile or key id and secret.");
  return false;
}

const createError = message => {
  console.error(message);
  return false;
};

readJson('package.json', console.error, false, function (err, data) {
  if (err) return createError("Error finding package.json file");
  const config = data['aws-cse-storage'];
  if(!config){
    console.error("Error finding `aws-cse-storage` key in your package.json")
    return false;
  }

  const args = process.argv.splice(2);

  const kmsId = config['kms-id'];
  if (!kmsId) return createError("`kms-id` is required in config.");
  const bucket = config.bucket;
  if (!bucket) return createError("`bucket` key is required in config.");
  const files = config.files;
  if (!files || typeof files !== 'object') return createError("`files` key is required in config and must be in object key -> value format");
  switch(args[0]) {
    case 'upload': 
      return Object.keys(files).forEach(key => factory.encryptAndUpload(key, files[key], kmsId, bucket)) 
    default:
      return Object.keys(files).forEach(key => factory.downloadAndDecrypt(key, files[key], bucket)) 
  }
});
