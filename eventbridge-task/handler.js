

const { DynamoDBClient, UpdateItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');

const ddbClient = new DynamoDBClient({ region: 'us-east-1'});
const eventBridgeClient = new EventBridgeClient({ region: 'us-east-1'});

module.exports.eventCounter = async () => {
    const currentTime = new Date().toISOString();
    const checkParams = {
        TableName: 'eventCounteredd',
        Key: {
            'counterId': { S: '102' }
        },
        ProjectionExpression: 'counterEnabled' 
    };

    try {
        const getItemCommand = new GetItemCommand(checkParams);
        const getItemResponse = await ddbClient.send(getItemCommand);

        if (
            getItemResponse.Item &&
            getItemResponse.Item.counterEnabled &&
            getItemResponse.Item.counterEnabled.BOOL === false 
        ) {
            console.log('Counter is manually disabled. Skipping increment.');
            return { statusCode: 200, body: 'Counter stopped manually' };
        }
        const params = {
        TableName: 'eventCounteredd',
        Key: {
            'counterId': { S: '102' }

        },
        UpdateExpression: 'SET counterValue = if_not_exists(counterValue, :initial) + :incr, ' +
                          'updatedAt = :updatedAt,' +'createdAt = if_not_exists(createdAt, :createdAt)',
        ExpressionAttributeValues: {
            ':initial': { N: '0' },
            ':incr': { N: '1' },
            ':updatedAt': { S: currentTime },
            ':createdAt': { S: currentTime }

        },
        ReturnValues: 'UPDATED_NEW'
    };

    
        const updateCommand = new UpdateItemCommand(params);
        const updatedCounter = await ddbClient.send(updateCommand);

        console.log('Counter updated:', updatedCounter.Attributes.counterValue.N);

        const putEventsCommand = new PutEventsCommand({
            Entries: [{
                Source: 'custom.counterUpdate',
                DetailType: 'CounterUpdated',
                Detail: JSON.stringify({ counterValue: updatedCounter.Attributes.counterValue.N })
            }]
        });
        await eventBridgeClient.send(putEventsCommand);

        return { statusCode: 200, body: JSON.stringify(updatedCounter.Attributes.counterValue.N) };
    } catch (err) {
        console.error('Error updating counter:', err);
        return { statusCode: 500, body: 'Error updating counter' };
    }
};