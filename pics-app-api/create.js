import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from ".libs/response-lib";

export async function main(event, context, callback) {
	// Request body is passed in as a JSON encoded string in 'event.body'
	const data = JSON.parse(event.body);
	
	const params = {
		TableName: "pictures",
		// 'Item' contains the attributes of the item to be created
		// - 'userId': user identities are federated through the Cognito Identity Pool,
		//				we will use the identity id as the user id of the authenticated user
		// - 'picId': a unique uuid
		// - 'image': parsed from request body
		// - 'description': parsed from request body
		// - 'ttl': parsed from request body
		// - 'createdAt': current Unix timestamp
		Item: {
			userId: event.requestContext.identity.cognitoIdentityId,
			picId: uuid.v1(),
			image: data.content,
			description: data.description,
			ttl: data.ttl
			createdAt: Date.now()
		}
	};
	
	try {
		await dynamoDbLib.call("put", params);
		return success(params.Item);
	} catch (e) {
	return failure({ status: false });
	}
}