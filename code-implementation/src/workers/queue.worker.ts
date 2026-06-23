import {
    ReceiveMessageCommand,
    DeleteMessageCommand,
    SQSClient,
} from "@aws-sdk/client-sqs";

import nodemailer from "nodemailer";
import { ENV_VARS } from "../config/envVars";
import { AWS_CONFIG } from "../config";

const QUEUE_URL = ENV_VARS.EMAIL_QUEUE_URL;

const transporter = nodemailer.createTransport({
    host: ENV_VARS.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: ENV_VARS.SMTP_USER,
        pass: ENV_VARS.SMTP_PASSWORD,
    },
});

const sqsClient = new SQSClient(AWS_CONFIG);

async function pollEmailQueue() {
    while (true) {
        try {
            const response = await sqsClient.send(
                new ReceiveMessageCommand({
                    QueueUrl: QUEUE_URL,
                    MaxNumberOfMessages: 10,
                    WaitTimeSeconds: 20,
                }),
            );

            if (!response.Messages?.length) {
                continue;
            }
            for (const message of response.Messages) {
                try {
                    const payload = JSON.parse(message.Body || "{}");
                    const data = payload.data;
                    console.log(payload);

                    await transporter.sendMail({
                        from: ENV_VARS.SMTP_FROM,
                        to: data.to,
                        subject: data.subject,
                        html: data.html,
                    });

                    await sqsClient.send(
                        new DeleteMessageCommand({
                            QueueUrl: QUEUE_URL,
                            ReceiptHandle: message.ReceiptHandle!,
                        }),
                    );

                    console.log(`Email sent to ${data.to}`);
                } catch (error) {
                    console.error("Email processing failed", error);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}

async function pollOrderQueue() {
    while (true) {
        try {
            const response = await sqsClient.send(
                new ReceiveMessageCommand({
                    QueueUrl: ENV_VARS.ORDER_QUEUE_URL,
                    MaxNumberOfMessages: 10,
                    WaitTimeSeconds: 20,
                }),
            );

            if (!response.Messages?.length) {
                continue;
            }
            for (const message of response.Messages) {
                try {
                    const payload = JSON.parse(message.Body || "{}");
                    const data = JSON.parse(payload.Message).data;
                    const type = JSON.parse(payload.Message).type;
                    if (type === "ORDER_CREATED") {
                        console.log("Order created");
                    }

                    await sqsClient.send(
                        new DeleteMessageCommand({
                            QueueUrl: ENV_VARS.ORDER_QUEUE_URL,
                            ReceiptHandle: message.ReceiptHandle!,
                        }),
                    );
                    console.log("Order processed");
                } catch (error) {
                    console.error("Order processing failed", error);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}

pollEmailQueue();
pollOrderQueue();
