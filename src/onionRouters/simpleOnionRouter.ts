import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT, REGISTRY_PORT } from "../config";

let lastReceivedEncryptedMessage: string | null = null;
let lastReceivedDecryptedMessage: string | null = null;
let lastMessageDestination: number | null = null;

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

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

  onionRouter.get("/getPrivateKey", async (req, res) => {
    //appel de la route getPrivateKey du registry
    const response = await fetch(
      `http://localhost:${REGISTRY_PORT}/getPrivateKey/${nodeId}`
    );
    const data = await response.json();
    res.status(response.status).json(data);
  });

  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  return server;
}

export async function registerNodes(n: number) {
  for (let nodeId = 0; nodeId < n; nodeId++) {
    const response = await fetch(
      `http://localhost:${REGISTRY_PORT}/registerNode`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodeId }),
      }
    );

    if (!response.ok) {
      console.error(
        `Erreur lors de l'enregistrement du nœud ${nodeId} :`,
        response.status
      );
    }
  }
}
