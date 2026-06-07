const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate a Smart Bid (Cover Letter + Amount) using Gemini
// @route   POST /api/ai/generate-proposal
// @access  Private
const generateProposal = async (req, res) => {
    try {
        const { jobTitle, jobDescription, budget, freelancerSkills } = req.body;

        const prompt = `
            You are an expert AI Bidding Assistant for a freelance marketplace.
            Write a highly professional, concise, and persuasive cover letter for a freelancer applying to the following job. 
            Also suggest an optimal bid amount (as a number) based on the client's budget.
            
            Job Title: ${jobTitle}
            Job Description: ${jobDescription}
            Client's Budget: $${budget}
            Freelancer's Skills: ${freelancerSkills || 'General web development, communication'}

            Return the response STRICTLY as a valid JSON object with two keys:
            - "coverLetter": (string) The generated cover letter.
            - "suggestedBid": (number) The suggested bid amount in dollars.
            
            Do not include any markdown formatting like \`\`\`json in the output.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        // The response text is guaranteed to be JSON due to responseMimeType
        const resultText = response.text;
        
        try {
            const parsedResult = JSON.parse(resultText);
            res.json(parsedResult);
        } catch (e) {
            // Fallback parsing just in case
            const cleaned = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
            res.json(JSON.parse(cleaned));
        }

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ message: 'Error generating proposal from AI.' });
    }
};

module.exports = {
    generateProposal
};
