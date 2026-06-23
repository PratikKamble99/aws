import express, { Request, Response } from "express";
import { publishMetric } from "./lib/aws/cloudwatch.client";
import { pushToEmailQueue } from "./services/email-queue.service";
import { publishSNS } from "./services/sns.service";

const app = express();
const PORT = process.env.PORT || 3000;

// JSON body parser middleware
app.use(express.json());

// Sample Route
app.get("/", async (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

// Custom metrics example
app.get("/users", async (req: Request, res: Response) => {
    await publishMetric(req, "UserApiRequestCount", 3);

    res.json({ success: true });
});

// SQS example
app.post("/register", async (req: Request, res: Response) => {
    const { email } = req.body;

    await pushToEmailQueue({
        type: "EMAIL",
        data: {
            to: email,
            subject: "Welcome",
            html: "<h1>Welcome to our platform</h1>",
        },
    });

    res.json({
        success: true,
    });
});

app.post("/order", async (req: Request, res: Response) => {
    await publishSNS(
        {
            type: "ORDER_CREATED",
            data: req.body,
        },
        "ORDER_CREATED",
    );

    res.json({
        success: true,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
