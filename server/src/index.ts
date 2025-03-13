import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.post('/', async (req, res) => {
    const { messages } = req.body;
    const config = {
    configurable: {
        thread_id: '1',
    },
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Use the agent
const finalState = await app.invoke(
    {
        messages: [new HumanMessage('what is the weather in sf')],
    },
    config,
);
console.log(finalState.messages[finalState.messages.length - 1].content);

const nextState = await app.invoke(
    {
        // Including the messages from the previous run gives the LLM context.
        // This way it knows we're asking about the weather in NY
        messages: [new HumanMessage('what about ny')],
    },
    config,
);
console.log(nextState.messages[nextState.messages.length - 1].content);
