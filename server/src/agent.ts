import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { ChatOpenAI } from '@langchain/openai';
import { MemorySaver, MessagesAnnotation, StateGraph, START, END } from '@langchain/langgraph';
import { createReactAgent, ToolNode } from '@langchain/langgraph/prebuilt';

import dotenv from 'dotenv';

dotenv.config();
// Define the tools for the agent to use
const tools = [new TavilySearchResults({ maxResults: 3 })];
const toolNode = new ToolNode(tools);

const memorySaver = new MemorySaver();

// Create a model and give it access to the tools
const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
}).bindTools(tools);

// Define the function that determines whether to continue or not
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
        return 'tools';
    }

    return END;
}

// Define the function that calls the model
async function callModel(state: typeof MessagesAnnotation.State) {
    const response = await model.invoke(state.messages);

    // We return a list, because this will get added to the existing list
    return { messages: [response] };
}

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
    .addNode('agent', callModel)
    .addEdge(START, 'agent')
    .addNode('tools', toolNode)
    .addEdge('tools', 'agent')
    .addConditionalEdges('agent', shouldContinue);

// Finally, we compile it into a LangChain Runnable.
// the name of the export must be the same as what come after the path to this filename in langgraph.json
export const app = workflow.compile({
    checkpointer: memorySaver,
});
