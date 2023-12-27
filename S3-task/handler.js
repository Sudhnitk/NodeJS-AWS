const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { fromUtf8 } = require('@aws-sdk/util-utf8-node');
const s3Client = new S3Client({ region: "us-east-1" });
const bucketName = "myintro-bucket"; 

module.exports.uploadFile = async (event) => {
  try {
    const { fileName, fileContent } = JSON.parse(event.body); 

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: fromUtf8(fileContent), 
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully!",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error uploading file to S3",
        error: error.message,
      }),
    };
  }
};

module.exports.fetchData = async (event) => {
  try {
    const fileName = event.pathParameters.fileName; 
    console.log('Retrieving file from S3 with filename:', fileName);

    
    const getObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
    });

    const { Body } = await s3Client.send(getObjectCommand);

    if (Body) {
       
        let fileContent = '';
        for await (const chunk of Body) {
            fileContent += chunk.toString();
        }
        console.log('File content:', fileContent);

        return {
            statusCode: 200,
            body: JSON.stringify({ fileContent }),
        };
    } else {
        console.error('Empty or invalid response from S3');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Empty or invalid response from S3' }),
        };
    }
} catch (err) {
    console.error('Error fetching file from S3:', err);

    return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
    };
}
};