const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

app.post("/kysy", async (req, res) => {
  const viesti = req.body.viesti;
  try {
    const vastaus = await openai.createChatCompletion({
      model: "gpt-4-1106-preview",
      messages: [{ role: "user", content: viesti }],
    });
    res.json({ vastaus: vastaus.data.choices[0].message.content });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ virhe: "Virhe tekoälykyselyssä." });
  }
});

app.listen(3000, () => console.log("Palvelin käynnissä portissa 3000"));
