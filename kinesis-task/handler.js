const { FirehoseClient, PutRecordCommand } = require('@aws-sdk/client-firehose');
const { fromUtf8 } = require('@aws-sdk/util-utf8-node');
const firehoseClient = new FirehoseClient({ region: 'us-east-1' });

exports.sendToFirehose2 = async (event) => {

    try {
        const requestBody = JSON.parse(event.body);
        console.log('Parsed request body:', requestBody);
    if (!event.body) {
        console.error('Missing or empty request body');
        return { statusCode: 400, body: 'Missing or empty request body' };
    }
    

    const params = {
        DeliveryStreamName: 'myDeliveryStream3',
        Record: {
            Data: fromUtf8(JSON.stringify(requestBody))
        }
    };
        const response = await firehoseClient.send(new PutRecordCommand(params));
        console.log('Kinesis Firehose response:', response); 
        return { statusCode: 200, body: 'Data sent to Kinesis Firehose successfully!' };
    } catch (error) {
        console.error('Error sending data to Kinesis Firehose:', error);
        return { statusCode: 500, body: 'Error sending data to Kinesis Firehose' };
    }
};
