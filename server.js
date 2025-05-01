const express = require("express");
const OpenAI = require("openai");
const cors = require("cors"); // 🔧 CORS-kirjasto lisätty
require("dotenv").config();

const app = express();
app.use(cors()); // ✅ Salli pyynnöt selaimesta (HTML-testi)
app.use(express.json()); // ✅ JSON-bodyjen käsittely

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/kysy", async (req, res) => {
  const viesti = req.body.viesti;

  // Tarkistus: onko viesti olemassa ja tekstimuodossa?
  if (!viesti || typeof viesti !== "string") {
    return res.status(400).json({ virhe: "Viesti puuttuu tai ei ole tekstimuodossa." });
  }

  try {
    const vastaus = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: viesti }],
    });

    res.json({ vastaus: vastaus.choices[0].message.content });
  } catch (err) {
    console.error("Virhe tekoälykyselyssä:", err.message);
    res.status(500).json({ virhe: "Virhe tekoälykyselyssä." });
  }
});

app.listen(3000, () => {
  console.log("Palvelin käynnissä portissa 3000");
});
