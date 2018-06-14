# aws-cse-storage

Client-side encrypted s3 storage.  Encrypt sensitive files client side and then upload to s3 bucket for storage.  Download files and decrypt.  Integrates with package.json to provide ease of .env and other sensitive file sharing.


## Examples

aws-cse-storage needs three items to work correctly, the id of the encryption key being used to encrypt, you can find more info [here](https://aws.amazon.com/kms/), name of the bucket, and a list of files in object form with the key being the s3 key and the value being the location of the file in relation to the package.json.

Full package.json support:
```
...
"aws-cse-storage": {
  "kms-id": "XXXXXX-XXXX-XXXX-XXXXXXXXXXX-XXXXXXX",
  "bucket": "XXXXXXXXXX",
  "files": {
    "namespace/filename": "path/to/.env" /* any type of flat file can be encrypted */
  }
},
...
```
and in the command-line:
`aws-cse-storage download`  or just `aws-cse-storage`
or 
`aws-cse-storage upload`

the kms id and bucket can be declared as environment variables as well, like so:
`KMS_ID=XXXXX-XXX-XXX-XXX-XXXXX CSE_BUCKET=XXXXXXX aws-cse-storage`
 
 with only the files in the package.json
 
```
...
"aws-cse-storage": {
  "files": {
    "namespace/filename": "path/to/.env" /* any type of flat file can be encrypted */
  }
},
...
```
