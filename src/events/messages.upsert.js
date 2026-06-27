import serialize from "#lib/core/serialize.js";
import { getMessageContent } from "#lib/utils.js";
import { isJidGroup } from "baileys";
import view from "../commands/view.js";
import set from "../commands/set.js";

const processed = new Set();

export default async (sock, { messages, type }) => {
    for (const msg of messages) {
        console.log(`[Recibido] from=${msg.key?.remoteJid} hasMessage=${!!msg.message}`);
    }

    if (type !== "notify") return;

    try {
        const msg = messages[0];
        if (!msg) return;
        if (msg.key.remoteJid === "status@broadcast") return;

        const msgId = msg.key.id;
        if (processed.has(msgId)) return;
        processed.add(msgId);

        if (processed.size > 200) {
            processed.delete(processed.values().next().value);
        }

        if (!msg.message) {
            console.log(`[Recibido] (Bad MAC) ignorando id=${msgId}`);
            return;
        }

        const m = await serialize(msg, sock);

        const content = (getMessageContent(msg) || "").trim().toLowerCase();

        // /set (permitido desde DM o grupo, para poder usar un grupo como destino de forward)
        if (content === "/set") {
            console.log("[Comando] /set");
            return await set.execute(m, { sock });
        }

        // El reenvío de View Once al responder solo aplica en chats privados
        if (isJidGroup(msg.key.remoteJid)) return;

        // Reenvío de View Once al responder
        if (m.quoted) {
            console.log("[Reply] Ejecutando view");
            return await view.execute(m, { sock });
        }

    } catch (error) {
        console.error("[upsert] Error procesando el mensaje:", error);
    }
};