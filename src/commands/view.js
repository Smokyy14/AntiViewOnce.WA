import { generateWAMessageFromContent } from "baileys";

const votype = [
    "viewOnceMessage",
    "viewOnceMessageV2",
    "viewOnceMessageV2Extension"
];

export default {
    name: "view",

    async execute(m, { sock }) {
        const relayTo = process.env.forwardTo;
        if (!relayTo) return;

        const { msg, type } = m.quoted;

        if (!msg?.viewOnce && !votype.includes(type))
            return;

        const content = structuredClone(msg);
        content.viewOnce = false;

        const proto = generateWAMessageFromContent(
            relayTo,
            { [type]: content },
            {
                userJid: sock.user.id,
                quoted: m
            }
        );

        await sock.relayMessage(relayTo, proto.message, {
            messageId: proto.key.id
        });
    }
};