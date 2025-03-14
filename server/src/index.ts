import express from 'express';
import cors from 'cors';
import { HumanMessage } from '@langchain/core/messages';

import { agent } from './agent.js';

const app = express();
const port = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/', async (req, res) => {
    await agent.invoke(
        {
            messages: [new HumanMessage('what is the weather in sf')],
        },
        config,
    );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const config = {
    configurable: {
        thread_id: '1',
    },
};

// Use the agent
const finalState = 
console.log(finalState.messages[finalState.messages.length - 1].content);

const nextState = await agent.invoke(
    {
        // Including the messages from the previous run gives the LLM context.
        // This way it knows we're asking about the weather in NY
        messages: [new HumanMessage('what about ny')],
    },
    config,
);
console.log(nextState.messages[nextState.messages.length - 1].content);
