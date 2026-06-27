import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateWAMessageFromContent } from "baileys";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const votype = [
    "viewOnceMessage",
    "viewOnceMessageV2",
    "viewOnceMessageV2Extension"
];

export default {
    name: "view",

    async execute(m, { sock }) {
        const info = JSON.parse(fs.readFileSync(path.join(__dirname, "../data.json"), "utf8"));
        const relayTo = info.forward;

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