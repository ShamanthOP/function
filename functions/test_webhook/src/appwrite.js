import { Client, Databases, ID, Permission, Role } from "node-appwrite";

class AppwriteService {
    constructor() {
        const client = new Client();
        client
            .setEndpoint(
                process.env.APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1"
            )
            .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
            .setKey(process.env.APPWRITE_API_KEY);

        this.databases = new Databases(client);
    }

    async doesRoomExist(roomId) {
        try {
            await this.databases.getDocument(
                process.env.MASTER_DATABASE_ID,
                process.env.ROOMS_COLLECTION_ID,
                roomId
            );
            return true;
        } catch (err) {
            if (err.code !== 404) throw err;
            return false;
        }
    }

    async deleteRoom(roomId) {
        // Deleting room doc inside rooms collection in master database
        await this.databases.deleteDocument(
            masterDatabaseId,
            roomsCollectionId,
            roomId
        );

        // Removing participants from collection
        const participantColRef = await this.databases.listDocuments(
            masterDatabaseId,
            participantsCollectionId,
            [Query.equal("roomId", [roomDocId])]
        );
        participantColRef.documents.forEach(async (participant) => {
            await this.databases.deleteDocument(
                masterDatabaseId,
                participantsCollectionId,
                participant.$id
            );
        });
    }
}

export default AppwriteService;
