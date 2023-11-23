require('dotenv').config();
const ApiLink: string = process.env.API_LINK || "https://localhost:3005";

const apiKey = process.env.Api_Key || "";
const apiUrl = process.env.Api_Url || "";

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