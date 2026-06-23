import { SNSClient } from "@aws-sdk/client-sns";
import { AWS_CONFIG } from "../../config";

export const snsClient = new SNSClient(AWS_CONFIG);
