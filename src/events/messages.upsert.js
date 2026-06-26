import serialize from "#lib/core/serialize.js";
import { isJidGroup } from "baileys";
import view from "../commands/view.js";

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
        if (isJidGroup(msg.key.remoteJid)) return;

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

        // Solo ejecutar si respondió a un mensaje
        if (!m.quoted) return;

        console.log(`[Reply] Ejecutando ${view.name}`);
        await view.execute(m, { sock });

    } catch (error) {
        console.error("[upsert] Error procesando el mensaje:", error);
    }
};