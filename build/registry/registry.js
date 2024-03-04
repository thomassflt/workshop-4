"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchRegistry = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const config_1 = require("../config");
const crypto_1 = require("../crypto");
let registry = { nodes: [] };
async function launchRegistry() {
    const _registry = (0, express_1.default)();
    _registry.use(express_1.default.json());
    _registry.use(body_parser_1.default.json());
    // TODO implement the status route
    // _registry.get("/status", (req, res) => {});
    _registry.get("/status", (req, res) => {
        res.status(200).send("live");
    });
    _registry.post("/registerNode", async (req, res) => {
        //recupere le nodeID
        const nodeId = req.body.nodeId;
        // Génére une paire de clés privée/publique
        const { privateKey, publicKey } = await (0, crypto_1.generateRsaKeyPair)();
        const node = {
            nodeId,
            pubKey: await (0, crypto_1.exportPubKey)(publicKey),
            prvKey: await (0, crypto_1.exportPrvKey)(privateKey),
        };
        registry.nodes.push(node);
        res.status(200).json({ nodeId });
    });
    _registry.get("/getPrivateKey/:nodeId", async (req, res) => {
        const nodeId = parseInt(req.params.nodeId, 10);
        const node = registry.nodes.find((n) => n.nodeId === nodeId);
        if (!node) {
            res.status(404).json({ error: "Node not found" });
            return;
        }
        if (!node.prvKey) {
            res.status(500).json({ error: "Failed to export private key" });
            return;
        }
        res.status(200).json({ result: node.prvKey });
    });
    _registry.get("/getNodeRegistry", (req, res) => {
        const nodes = registry.nodes.map((node) => {
            return {
                nodeId: node.nodeId,
                pubKey: node.pubKey,
            };
        });
        res.status(200).json({ nodes });
    });
    const server = _registry.listen(config_1.REGISTRY_PORT, () => {
        console.log(`registry is listening on port ${config_1.REGISTRY_PORT}`);
    });
    return server;
}
exports.launchRegistry = launchRegistry;
