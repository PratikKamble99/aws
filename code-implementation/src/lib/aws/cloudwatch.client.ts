import {
    CloudWatchClient,
    PutMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";
import { Request } from "express";
import { AWS_CONFIG } from "../../config";

const cloudwatchClient = new CloudWatchClient(AWS_CONFIG);

export async function publishMetric(
    req: Request,
    metricName: string,
    value: number,
) {
    try {
        await cloudwatchClient.send(
            new PutMetricDataCommand({
                Namespace: "MyApplication",
                MetricData: [
                    {
                        MetricName: metricName,
                        Value: value,
                        Unit: "Count",
                        Timestamp: new Date(),
                        Dimensions: [
                            {
                                Name: "Route",
                                Value: req.url,
                            },
                        ],
                    },
                ],
            }),
        );
    } catch (error) {
        console.error("Failed to publish metric:", error);
    }
}
