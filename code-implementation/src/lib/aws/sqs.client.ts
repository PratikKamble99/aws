import { SQSClient } from "@aws-sdk/client-sqs";
import { AWS_CONFIG } from "../../config";

export const sqsClient = new SQSClient(AWS_CONFIG);
