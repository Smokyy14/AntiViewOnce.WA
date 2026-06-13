import { generateWAMessageFromContent } from "baileys";

export default {
    name: "command",
    triggers: [
        "foto",
        "video",
        "" // Puedes añadir más.
    ],

    async execute(m, { sock }) {

        const relayTo = process.env.forwardTo
        if (!relayTo) return console.log("NO SE CONFIGURÓ EL NUMERO DE REENVIO. REVISAR ARCHIVO .env")

        try {
            if (!m.quoted) {
                console.log("El mensaje que respondiste NO es de unica vez y no se reenvió.")
                return // Esto con el fin de no "delatar" el bot en tu DM
            }
            
            const msgContent = m.quoted.msg;
            const type = m.quoted.type;

            if (
                !msgContent?.viewOnce &&
                type !== "viewOnceMessage" &&
                type !== "viewOnceMessageV2" &&
                type !== "viewOnceMessageV2Extension"
            ) {
                return console.log("El mensaje citado no es de visualización única.");
            }

            // Clona y desactiva el flag viewOnce
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
            return;
        }
    },
};
