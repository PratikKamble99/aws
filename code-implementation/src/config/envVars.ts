import dotenv from "dotenv";
dotenv.config();

export const ENV_VARS = {
    AWS_REGION: process.env.AWS_REGION!,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    EMAIL_QUEUE_URL: process.env.EMAIL_QUEUE_URL!,
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
    SMTP_FROM: process.env.SMTP_FROM!,
    PORT: process.env.PORT!,
    SNS_TOPIC_ARN: process.env.SNS_TOPIC_ARN!,
    ORDER_QUEUE_URL: process.env.ORDER_QUEUE_URL!,
} as const;
