const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini (only if key exists)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

exports.enhanceText = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "Text is required" });

        if (!genAI) {
            // Simulated AI for demo if no key
            return res.json({
                enhancedText: `[AI Simulated]: Optimized: ${text} -> Demonstrated proficiency in executing key tasks utilizing advanced methodologies.`
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Rewrite the following resume bullet point to be more professional, actionable, and result-oriented, using strong action verbs. Keep it concise. Input: "${text}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedText = response.text().replace(/^["']|["']$/g, '').trim(); // Remove quotes if any

        res.json({ enhancedText });
    } catch (error) {
        console.error("AI Enhance Error:", error);
        res.status(500).json({ message: "Failed to enhance text" });
    }
};

exports.generateSummary = async (req, res) => {
    try {
        const { skills, projects, experience } = req.body;

        if (!genAI) {
            return res.json({
                summary: "Passionate Software Developer with expertise in modern web technologies. Proven track record of building scalable applications and solving complex problems."
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Write a professional resume summary (3-4 sentences) for a software developer with the following profile:
        Skills: ${skills}
        Key Projects: ${projects}
        Experience: ${experience || "Entry Level"}
        Focus on results and technical proficiency.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        res.json({ summary: response.text() });
    } catch (error) {
        console.error("AI Summary Error:", error);
        res.status(500).json({ message: "Failed to generate summary" });
    }
};
