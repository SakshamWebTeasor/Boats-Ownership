// require('dotenv').config();
// const ApiLink: string = process.env.API_LINK || "http://localhost:3005";

// const apiKey = process.env.API_KEY;
// const apiUrl = process.env.API_URL;

export const ApiLink = "https://8607-27-255-248-254.ngrok-free.app";
export const apiKey = "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";
export const apiUrl = "https://api.openai.com/v1/chat/completions";

export async function getChatResponse(prompt: string) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
        }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

export default ApiLink;