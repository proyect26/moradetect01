const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfDir = '/home/elian/Escritorio/moradetec (1)/infomacionparaelrobot';
const outputJsonPath = path.join(__dirname, 'src', 'data', 'pdfKnowledge.json');

async function extractTextFromPDFs() {
    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
    let combinedText = '';

    for (const file of files) {
        console.log(`Processing: ${file}`);
        const dataBuffer = fs.readFileSync(path.join(pdfDir, file));
        try {
            const data = await pdf(dataBuffer);
            combinedText += `\n--- SOURCE: ${file} ---\n` + data.text;
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }

    const paragraphs = combinedText.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 50);

    const knowledgeData = {
        documents: files,
        chunks: paragraphs,
        fullText: combinedText
    };

    fs.writeFileSync(outputJsonPath, JSON.stringify(knowledgeData, null, 2));
    console.log(`Successfully extracted ${paragraphs.length} paragraphs into ${outputJsonPath}`);
}

extractTextFromPDFs();
