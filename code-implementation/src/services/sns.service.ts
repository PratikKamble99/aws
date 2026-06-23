import { PublishCommand, PublishCommandInput } from "@aws-sdk/client-sns";

import { snsClient } from "../lib/aws/sns.client";
import { ENV_VARS } from "../config/envVars";
import { QueueMessage } from "./email-queue.service";

export async function publishSNS(message: QueueMessage, subject?: string) {
    const params: PublishCommandInput = {
        TopicArn: ENV_VARS.SNS_TOPIC_ARN,
        Subject: subject,
        Message: JSON.stringify(message),
    };

    const response = await snsClient.send(new PublishCommand(params));

    return response;
}
