import {
    Browsers,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
} from "baileys";
import pino from "pino";
import "dotenv/config";
import socket from "./lib/core/socket.js";
import { loadCommands, loadEvents } from "./lib/loaders.js";
import { setSock } from "./lib/botState.js";

// libsignal imprime los Bad MAC directamente con console.error/console.log
// antes de que Baileys los maneje. Los filtramos acá para no ensuciar la consola.
const NOISE_PATTERNS = [
    "Bad MAC",
    "Failed to decrypt",
    "Session error",
    "Bad session state",
    "decryptWithSessions",
];

const isNoise = (...args) =>
    args.some(a => typeof a === "string" && NOISE_PATTERNS.some(p => a.includes(p)));

const _error = console.error.bind(console);
const _log   = console.log.bind(console);

console.error = (...args) => { if (!isNoise(...args)) _error(...args); };
console.log   = (...args) => { if (!isNoise(...args)) _log(...args); };

const logger = pino({ level: "silent" });

export async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");
    const { version } = await fetchLatestBaileysVersion();

    const sock = socket({
        version,
        logger,
        browser: Browsers.ubuntu("chrome"),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
    });

    setSock(sock);
    sock.ev.on("creds.update", saveCreds);

    await loadEvents(sock);
    await loadCommands(sock);
}

startSock();

/* Code by https://github.com/DavidModzz ( Browsers.appropiate pasó a ser Browsers.ubuntu )*/