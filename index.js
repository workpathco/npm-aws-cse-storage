const readJson = require('read-package-json');
const factory = require('./factory.js');

// Error helper
const createError = message => {
  console.error(message);
};

readJson('package.json', console.error, false, (err, data) => {
  if (err) return createError("Error finding package.json file");

  // Check and retrieve package.json config
  const config = data['aws-cse-storage'];
  if(!config) return createError("Error finding `aws-cse-storage` key in your package.json")

  // Check and retrieve ksmId key in package.json config or env variable
  const kmsId = config['kms-id'] || process.env.KMS_ID;
  if (!kmsId) return createError("`kms-id` is required in config or environment variable.");

  // Check and retrieve bucket key in package.json config or env variable
  const bucket = config.bucket || process.env.CSE_BUCKET;
  if (!bucket) return createError("`bucket` key is required in config or environment variable.");

  // Check and retrieve files key in package.json config
  const files = config.files;
  if (!files || typeof files !== 'object') return createError("`files` key is required in config and must be in object key -> value format");

  // Act accordingly 
  try{
    // Check and retrieve command line args removing first two unneeded args 
    const args = process.argv.splice(2);
    switch(args[0]) {
      case 'upload': 
        return Object.keys(files).forEach(key => factory.encryptAndUpload(key, files[key], kmsId, bucket)) 
      default:
        return Object.keys(files).forEach(key => factory.downloadAndDecrypt(key, files[key], bucket)) 
    }
  } catch(err) {
    createError(err.message); 
  }
});
