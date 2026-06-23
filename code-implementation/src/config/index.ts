import { ENV_VARS } from "./envVars";

export const AWS_CONFIG = {
    region: ENV_VARS.AWS_REGION,
    credentials: {
        accessKeyId: ENV_VARS.AWS_ACCESS_KEY_ID,
        secretAccessKey: ENV_VARS.AWS_SECRET_ACCESS_KEY,
    },
};
