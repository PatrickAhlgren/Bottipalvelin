const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Viestirajoitus: max 5 pyyntöä / minuutti / IP
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuutti
  max: 5,
  message: { virhe: "Liikaa pyyntöjä. Yritä hetken kuluttua uudelleen." }
});
app.use("/kysy", limiter);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/kysy", async (req, res) => {
  const viesti = req.body.viesti;

  // 🧼 Tarkistus: onko viesti olemassa ja järkevässä pituudessa
  if (!viesti || typeof viesti !== "string" || viesti.length < 2 || viesti.length > 300) {
    return res.status(400).json({ virhe: "Viestin pituus ei kelpaa." });
  }

  try {
    const vastaus = await openai.chat.completions.create({
      model: "gpt-4-turbo",
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
