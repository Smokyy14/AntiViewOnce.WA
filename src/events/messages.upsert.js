import serialize from "#lib/core/serialize.js";
import { getMessageContent } from "#lib/utils.js";
import { isJidGroup } from "baileys";
import view from "../commands/view.js";

const processed = new Set();

export default async (sock, { messages, type }) => {
    for (const msg of messages) {
        console.log(`[Recibido] type=${type} id=${msg.key?.id} from=${msg.key?.remoteJid} hasMessage=${!!msg.message}`);
    }

    if (type !== "notify") return;

    try {
        const msg = messages[0];
        if (!msg) return;
        if (msg.key.remoteJid === "status@broadcast") return;
        if (isJidGroup(msg.key.remoteJid)) return;

        // Deduplicación
        const msgId = msg.key.id;
        if (processed.has(msgId)) return;
        processed.add(msgId);
        if (processed.size > 200) {
            const first = processed.values().next().value;
            processed.delete(first);
        }

        // Si no hay mensaje descifrado, loggearlo y salir sin crashear
        if (!msg.message) {
            console.log(`[Recibido] Mensaje sin descifrar (Bad MAC) ignorando id=${msgId}`);
            return;
        }

        const content = getMessageContent(msg);
        if (!content) {
            console.log(`[Recibido] Debe ser un sticker. `);
            return;
        }

        const lowerContent = content.toLowerCase().trim();
        console.log(`[Recibido] Contenido recibido: "${lowerContent}"`);

        const triggered = view.triggers.some(
            (trigger) => lowerContent.includes(trigger.toLowerCase())
        );
        if (!triggered) return;

        const m = await serialize(msg, sock);
        console.log(`[Trigger] "${lowerContent}" → ${view.name}`);
        await view.execute(m, { content, sock });

    } catch (error) {
        console.error("[upsert] Error procesando el mensaje:", error);
    }
};
