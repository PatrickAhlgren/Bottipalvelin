const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/kysy", async (req, res) => {
  const viesti = req.body.viesti;
  try {
    const vastaus = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: viesti }],
    });
    res.json({ vastaus: vastaus.choices[0].message.content });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ virhe: "Virhe tekoälykyselyssä." });
  }
});

app.listen(3000, () => console.log("Palvelin käynnissä portissa 3000"));
