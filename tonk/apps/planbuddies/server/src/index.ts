import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = 6082; // Changed to avoid port conflict

// Middleware
app.use(express.json());
app.use(cors());

// OpenAI configuration via variable d'environnement
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY n'est pas défini dans le fichier .env !");
  process.exit(1);
}

// Basic route for hello world
app.get("/api/hello", (req, res) => {
  res.send("Hello World Api! 🌍");
});

app.get("/ping", (req, res) => {
  res.send("pong! 🏓");
});

// Route to generate random user descriptions
app.get("/api/generate-description", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "🎉 Salut ! Tu es un assistant qui génère des descriptions courtes, aléatoires et fun pour des **users** sur notre appli de planification sociale. Reste bref (max 30 mots) et créatif !"
        },
        {
          role: "user",
          content: "Génère une description aléatoire et fun pour un profil d'utilisateur 😊"
        }
      ],
      max_tokens: 50,
    });

    const description = completion.choices[0]?.message?.content?.trim() || "Fun and adventurous person who loves trying new things!";
    res.json({ description });
  } catch (error) {
    console.error("Error generating description:", error);
    res.status(500).json({ error: "Failed to generate description" });
  }
});

// Route to generate personalized group description based on users and events
app.post("/api/generate-group-description", async (req, res) => {
  try {
    const { users, events } = req.body;

    if (!users || !events) {
      return res.status(400).json({ error: "Users and events data are required" });
    }

    let userNames = Object.values(users).map((user: any) => user.name).join(", ");
    
    let eventDetails = Object.values(events).map((event: any) => {
      const creator = users[event.createdBy]?.name || "Someone";
      return `"${event.title}" organisé par ${creator}`;
    }).join(", ");

    const prompt = `Génère une description fun et personnalisée (max 50 mots) pour un groupe d'amis qui organisent des événements ensemble en France 🇫🇷. 
Les **users** sont: ${userNames}. 
Leurs événements récents sont: ${eventDetails || "aucun événement pour l'instant"}. 
Ajoute des emojis (ex. 😊, 🎉) et mentionne quelques noms pour rendre le tout vivant !`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "🎊 Salut ! Tu es un assistant qui crée des descriptions personnalisées pour des groupes d'amis. Sois bref, créatif et ajoute quelques emojis 😊🎉."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
    });

    const description = completion.choices[0]?.message?.content?.trim() || 
      `A lively group of French friends (${userNames}) who love organizing fun events together!`;

    res.json({ description });
  } catch (error) {
    console.error("Error generating group description:", error);
    res.status(500).json({ error: "Failed to generate group description" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
