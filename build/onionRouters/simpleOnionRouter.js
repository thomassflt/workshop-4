"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNodes = exports.simpleOnionRouter = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const config_1 = require("../config");
let lastReceivedEncryptedMessage = null;
let lastReceivedDecryptedMessage = null;
let lastMessageDestination = null;
async function simpleOnionRouter(nodeId) {
    const onionRouter = (0, express_1.default)();
    onionRouter.use(express_1.default.json());
    onionRouter.use(body_parser_1.default.json());
    // onionRouter.get("/status", (req, res) => {});
    onionRouter.get("/status", (req, res) => {
        res.status(200).send("live");
    });
    // Route to get the last received encrypted message
    onionRouter.get("/getLastReceivedEncryptedMessage", (req, res) => {
        res.status(200).json({ result: lastReceivedEncryptedMessage });
    });
    // Route to get the last received decrypted message
    onionRouter.get("/getLastReceivedDecryptedMessage", (req, res) => {
        res.status(200).json({ result: lastReceivedDecryptedMessage });
    });
    // Route to get the destination of the last received message
    onionRouter.get("/getLastMessageDestination", (req, res) => {
        res.status(200).json({ result: lastMessageDestination });
    });
    const server = onionRouter.listen(config_1.BASE_ONION_ROUTER_PORT + nodeId, () => {
        console.log(`Onion router ${nodeId} is listening on port ${config_1.BASE_ONION_ROUTER_PORT + nodeId}`);
    });
    return server;
}
exports.simpleOnionRouter = simpleOnionRouter;
async function registerNodes(n) {
    for (let nodeId = 0; nodeId < n; nodeId++) {
        const response = await fetch(`http://localhost:${config_1.REGISTRY_PORT}/registerNode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nodeId }),
        });
        if (!response.ok) {
            console.error(`Erreur lors de l'enregistrement du nœud ${nodeId} :`, response.status);
        }
    }
}
exports.registerNodes = registerNodes;
