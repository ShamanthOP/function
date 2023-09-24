import { Client, Databases } from "node-appwrite";
import { WebhookReceiver } from "livekit-server-sdk";

export default async ({ req, res, log, error }) => {
    const client = new Client()
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const db = Databases(client);
    const receiver = new WebhookReceiver(
        `${process.env.LIVEKIT_API_KEY}`,
        `${process.env.LIVEKIT_API_SECRET}`
    );

    try {
        const event = receiver.receive(req.bodyRaw, req.get("Authorization"));
        log("Webhook called", event.event, event.room.sid);
        return res.json({ msg: "ok" });
    } catch (e) {
        error("Webhhok error", e);
        return res.json({ msg: "Server Error" });
    }
};
