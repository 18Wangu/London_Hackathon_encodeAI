import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6082; // Use environment variable with fallback

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// OpenAI configuration via environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is not defined in the .env file!");
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
          content: "🎉 Hi there! You're an assistant that generates short, random, and fun descriptions for **users** on our social planning app. Keep it brief (max 30 words) and creative! At the end of each description, include a short joke and finish with ellipsis (...). ALWAYS respond in English only."
        },
        {
          role: "user",
          content: "Generate a random and fun description for a user profile. End with a short joke and finish with ellipsis (...). Your response must be in English only. 😊"
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
      return `"${event.title}" organized by ${creator}`;
    }).join(", ");

    const prompt = `Generate a fun and personalized description (max 50 words) for a group of friends who organize events together in France 🇫🇷. 
The **users** are: ${userNames}. 
Their recent events are: ${eventDetails || "no events yet"}. 
Add emojis (e.g. 😊, 🎉) and mention some names to make it lively! End with a short joke and finish with ellipsis (...).`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "🎊 Hello! You're an assistant that creates personalized descriptions for groups of friends. Be brief, creative, and add some emojis 😊🎉. At the end of each description, include a short joke and finish with ellipsis (...). ALWAYS respond in English only."
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

// Route to generate event images based on title and description
app.post("/api/generate-event-image", async (req, res) => {
  try {
    const { title, description, items } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Event title is required" });
    }

    // Create a prompt that combines the event details
    let itemsText = "";
    if (items && items.length > 0) {
      itemsText = `Items for the event: ${items.map((item: any) => item.name).join(", ")}.`;
    }

    const prompt = `Create a vibrant, colorful image for a social event in France called "${title}". ${description ? `The event description is: ${description}.` : ""} ${itemsText} Style: Modern, friendly, social gathering with a French theme.`;

    // Generate the image using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0]?.url;
    
    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating event image:", error);
    res.status(500).json({ error: "Failed to generate event image" });
  }
});

// Route to generate AI-styled avatar from user photo
app.post("/api/generate-avatar", async (req, res) => {
  try {
    const { photoData } = req.body;
    
    if (!photoData) {
      return res.status(400).json({ error: "Photo data is required" });
    }

    // Generate the avatar using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Create a stylized, artistic avatar portrait based on this photo. Use a modern, vibrant art style with bold colors. Make it look professional and friendly.",
      n: 1,
      size: "512x512", // Smaller size to reduce API usage
    });

    const avatarUrl = response.data[0]?.url;
    
    if (!avatarUrl) {
      throw new Error("Failed to generate image");
    }

    res.json({ avatarUrl });
  } catch (error: any) {
    console.error("Error generating avatar:", error);
    // Send more detailed error information
    if (error.code === 'rate_limit_exceeded') {
      res.status(429).json({ 
        error: "API rate limit exceeded. Please try again later.",
        details: error.message || "Rate limit exceeded"
      });
    } else {
      res.status(500).json({ 
        error: "Failed to generate avatar", 
        details: error.message || "Unknown error" 
      });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});