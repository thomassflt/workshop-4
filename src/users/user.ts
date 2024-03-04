import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

let lastReceivedMessage: string | null = null;
let lastSentMessage: string | null = null;

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  // TODO implement the status route
  // _user.get("/status", (req, res) => {});
  _user.get("/status", (req, res) => {
    res.status(200).send("live");
  });

  _user.get("/getLastReceivedMessage", (req, res) => {
    res.json({ result: lastReceivedMessage });
  });

  _user.get("/getLastSentMessage", (req, res) => {
    res.json({ result: lastSentMessage });
  });

  _user.post("/message", (req, res) => {
    const { message } = req.body;

    if (message) {
      lastReceivedMessage = message;
      console.log(`Nouveau message reçu : ${message}`);
      res.status(200).send("success");
    } else {
      res.status(400).json({ error: "Aucun message fourni" });
    }
  });

  _user.post("/sendMessage", async (req, res) => {
    const { message, destinationUserId } = req.body;

    if (!message || destinationUserId === undefined) {
      res.status(400).json({ error: "Données invalides" });
      return;
    }

    try {
      // Logique pour envoyer le message à l'utilisateur de destination
      const destinationPort = BASE_USER_PORT + destinationUserId;
      await sendMessage(destinationPort, message);
      lastSentMessage = message;
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      res
        .status(500)
        .json({ error: "Une erreur est survenue lors de l'envoi du message" });
    }
  });

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(
      `User ${userId} is listening on port ${BASE_USER_PORT + userId}`
    );
  });

  return server;
}

async function sendMessage(userPort: number, message: string) {
  await fetch(`http://localhost:${userPort}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
}
