// src/services/email-queue.service.ts

import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "../lib/aws/sqs.client";
import { ENV_VARS } from "../config/envVars";

const QUEUE_URL = ENV_VARS.EMAIL_QUEUE_URL;

export interface QueueMessage {
    type: "EMAIL" | "ORDER_CREATED";
    data: Object;
}

export async function pushToEmailQueue(payload: QueueMessage) {
    await sqsClient.send(
        new SendMessageCommand({
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(payload),
        }),
    );
}
