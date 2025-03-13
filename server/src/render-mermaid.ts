import { app as agent } from './index.js';
import * as fs from 'fs/promises';
import { dirname, join } from 'path';

const __dirname = import.meta.dirname;

async function updateReadmeMermaid() {
    const graph = await agent.getGraphAsync();
    const mermaidDiagram = await graph.drawMermaid();

    // Read the README.md file
    const readmePath = join(__dirname, '../README.md');
    let readmeContent = await fs.readFile(readmePath, 'utf-8');

    // Define markers for the Mermaid diagram section
    const startMarker = '<!-- MERMAID-GRAPH-START -->';
    const endMarker = '<!-- MERMAID-GRAPH-END -->';

    // Create the new content with the Mermaid diagram
    const newSection = `${startMarker}
\`\`\`mermaid
${mermaidDiagram}
\`\`\`
${endMarker}`;

    // Replace the content between markers
    const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
    const updatedContent = readmeContent.replace(regex, newSection);

    // Write the updated content back to README.md
    await fs.writeFile(readmePath, updatedContent, 'utf-8');
    console.log('Successfully updated README.md with new Mermaid diagram');
}

// Execute the update
updateReadmeMermaid().catch((error) => {
    console.error('Failed to update README.md:', error);
    process.exit(1);
});
