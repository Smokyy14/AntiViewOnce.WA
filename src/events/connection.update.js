import { startSock } from "../index.js";
import { delay, DisconnectReason } from "baileys";
import { Boom } from "@hapi/boom";
import { ask } from "#lib/utils.js";
import { setSock, clearSock } from "#lib/botState.js";

export default async (sock, update) => {
    try {
        const { connection, lastDisconnect, qr } = update;
    
        if (connection === "connecting" || !!qr) {
            await delay(1500);
            // Lee el número desde la variable de entorno si está disponible,
            // si no lo pide por consola
            const phone = process.env.PHONE_NUMBER
                ?? await ask("Ingresa tu número de WhatsApp con el código de país, sin el signo +:\nEjemplo: 595981234567\n");

            const code = await sock.requestPairingCode(phone);
            console.log("Codigo de emparejamiento:", code);
            return;
        }
    
        if (connection === "open") {
            setSock(sock);
            console.log("Conexión abierta — Bot listo para enviar mensajes.");
            return;
        }
        
        if (connection === "close") {
            clearSock();

            const error      = lastDisconnect?.error;
            const boom       = new Boom(error);
            const statusCode = boom.output?.statusCode;
            
            const shouldReconnect = ![
                DisconnectReason.loggedOut,
                DisconnectReason.forbidden,
            ].includes(statusCode);
            
            console.log(
                `Conexión cerrada. Código: ${statusCode}. ${
                shouldReconnect ? "Reconectando..." : "No se reconectará."
                }`
            );
            
            if (!shouldReconnect) {
                console.error(`Conexión cerrada permanentemente. Eliminá la carpeta "auth" y volvé a emparejar.`);
                process.exit(1);
            }
            
            await startSock();
            return;
        }
    } catch (err) {
        console.error("Error en connection.update:", err);
    }
};
