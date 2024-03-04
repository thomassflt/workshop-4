import bodyParser from "body-parser";
import express from "express";
import { REGISTRY_PORT } from "../config";
import { exportPrvKey, exportPubKey, generateRsaKeyPair } from "../crypto";

export type Node = { nodeId: number; pubKey: string; prvKey: string };

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};

let registry: GetNodeRegistryBody = { nodes: [] };

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  // TODO implement the status route
  // _registry.get("/status", (req, res) => {});
  _registry.get("/status", (req, res) => {
    res.status(200).send("live");
  });

  _registry.post("/registerNode", async (req, res) => {
    //recupere le nodeID
    const nodeId = req.body.nodeId;

    if (registry.nodes.find((node) => node.nodeId === nodeId)) {
      res.status(400).json({ error: "Node already registered" });
      return;
    }
    // Génére une paire de clés privée/publique
    const { privateKey, publicKey } = await generateRsaKeyPair();

    const node: Node = {
      nodeId,
      pubKey: await exportPubKey(publicKey),
      prvKey: await exportPrvKey(privateKey),
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

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
