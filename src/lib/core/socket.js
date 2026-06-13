import {
    isPnUser,
    isLidUser,
    jidNormalizedUser,
    makeWASocket,
} from "baileys";
import { NodeCache } from "@cacheable/node-cache";

const msgCache = new NodeCache({ stdTTL: 60 * 10 });

export default (options) => {
    const sock = makeWASocket({
        ...options,
        msgRetryCounterCache: new NodeCache(),
        getMessage: async (key) => {
            const cached = msgCache.get(key.id);
            if (cached) return cached;
            return { conversation: "" };
        },
    });

    sock.ev.on("messages.upsert", ({ messages }) => {
        for (const msg of messages) {
            if (!msg.message) continue;
            msgCache.set(msg.key.id, msg.message);
        }
    });

    sock.msgCache = msgCache;

    sock.getPNForLID = async (lid) => {
        try {
            return await sock.signalRepository.lidMapping.getPNForLID(lid);
        } catch {
            const normalized = jidNormalizedUser(lid);
            return isPnUser(normalized) ? normalized : null;
        }
    };

    sock.getLIDForPN = async (pn) => {
        try {
            return await sock.signalRepository.lidMapping.getLIDForPN(pn);
        } catch {
            const normalized = jidNormalizedUser(pn);
            return isLidUser(normalized) ? normalized : null;
        }
    };

    return sock;
};
