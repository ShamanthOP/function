import AppwriteService from "./appwrite.js";
import LivekitService from "./livekit.js";

export default async (context) => {
    const { req, res, log, error } = context;

    const appwrite = new AppwriteService();
    const livekit = new LivekitService();

    try {
        const event = livekit.validateWebhook(context, req);
        if (!event) {
            return res.json({ success: false }, 401);
        }

        log(event);

        if (event.event === "room_finished") {
            // Appwrite room id is same as Livekit room name
            const appwriteRoomDocId = event.room.name;

            // Delete the room in appwrite if it still exists
            log(appwrite.doesRoomExist(appwriteRoomDocId));
            if (appwrite.doesRoomExist(appwriteRoomDocId)) {
                appwrite.deleteRoom(appwriteRoomDocId);
            }
        }
    } catch (e) {
        error(e);
        return res.json({ success: false }, 500);
    }

    return res.json({ success: true }, 200);
};
