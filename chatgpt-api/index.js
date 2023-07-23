import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";

config();

const { ORGANIZATION, API_KEY } = process.env;

const app = express();
const port = 8000;
app.use(bodyParser.json());
app.use(cors());

const configuration = new Configuration({
    organization: ORGANIZATION,
    apiKey: API_KEY
});

const openai = new OpenAIApi(configuration);

app.post('/openai', async (req, res) => {
    try {
        const { chats } = req.body;

        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: "system",
                    content: "chat gpt application"
                },
                ...chats,
            ]
        });

        res.json({
            output: result.data.choices[0].message
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

app.listen(port, () => {
    console.log(`server listing at ${port}`);
})