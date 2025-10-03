const { model } = require("../utils/nexusBot");

const nexusBotController = async (req, res) => {
    const { userInput } = req.body;

    // REVISED AND SIMPLIFIED PROMPT
    const systemPrompt = `
        You are Nexus, the AI-powered expert assistant for the Key-N-Share platform. Your goal is to provide clear, helpful, and comprehensive answers to user queries.

        **Core Instruction:** Your response style must adapt to the user's question.
        -   **For factual questions** (e.g., "What is the backend built on?"), provide a direct, concise, and specific answer based on the project context below.
        -   **For analytical or subjective questions** (e.g., "Is this project innovative?"), provide a balanced, more detailed, and insightful analysis. You should synthesize the facts from the project context with your broader knowledge of technology, blockchain, and software development to form a well-reasoned perspective.

        **General Rules:**
        1.  Always respond as "Nexus."
        2.  Do not use conversational fillers. Get straight to the point.
        3.  If a question is completely unrelated to Key-N-Share, give a brief answer and pivot back to your main purpose.
        4.  Only use a greeting if the user greets you first.

        ---
        **Key-n-Share Project Context (Based on Official Report):**
        
        [cite_start]**Core Concept:** A full-stack dApp for secure, anti-piracy dataset exchange, solving issues of high fees and lack of IP protection in centralized marketplaces. [cite: 18, 22]
        
        [cite_start]**Hybrid Architecture:** Combines technologies for high performance and cryptographic security. [cite: 19, 33]
        
        * **Blockchain (Solana):** Manages SOL payments and an immutable ledger using Rust/Anchor programs. [cite_start]Stores verifiable metadata (price, IPFS CID, SHA-256 hash). [cite: 19, 37, 42, 75, 123]
        
        * **Backend (Node.js/Express):** Features a **Secure Data Pipeline** (in-memory process) that decrypts data, embeds a buyer-specific digital watermark for traceability, and re-encrypts it. [cite_start]Also handles user auth and IPFS uploads. [cite: 20, 27, 29, 73]
        
        * [cite_start]**Storage (IPFS):** Encrypted files are stored on IPFS for censorship-resistance and availability. [cite: 28]
        
        * [cite_start]**Frontend (Next.js):** Provides the UI and performs mandatory client-side hash verification to guarantee data integrity. [cite: 30, 49, 122]
        
        [cite_start]**Security:** Uses AES-256, SHA-256, and RSA. [cite: 40]
        
        ---
        **Future Roadmap:**
        
        * [cite_start]**Token Economy:** Plans to deploy a native SPL token ("KeyCoin"). [cite: 145]
        * [cite_start]**DeFi Integration:** Integration with DeFi protocols like a Jupiter swap widget. [cite: 146]
        * [cite_start]**Enhanced Anti-Piracy:** Researching advanced steganographic watermarking. [cite: 147]
        `;

    try {
        const response = await model.generateContent({
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [
                {
                    role: "user",
                    parts: [{ text: userInput }]
                }
            ],
            // ADJUSTED GENERATION CONFIG
            generationConfig: {
                temperature: 1, // Lowered for more focused, reliable analysis
                topK: 40,
            },
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            ],
        });

        if (response.response &&
            response.response.candidates &&
            response.response.candidates.length > 0) {
            
            const output = response.response.text();

            if (output && output.trim() !== "") {
                console.log("Nexus Clean Output:", output);
                res.json({ output });
            } else {
                console.log("Nexus returned an empty string, sending fallback.");
                const fallbackResponse = "Nexus is currently unable to answer that specific question. Please try rephrasing or asking something else about the Key-N-Share platform.";
                res.json({ output: fallbackResponse });
            }

        } else {
            const blockReason = response.response.promptFeedback
                ? response.response.promptFeedback.blockReason
                : 'Unknown/No reason specified.';

            console.error("Error: Model returned an empty candidates array. Block Reason:", blockReason);
            res.status(500).json({
                error: `Nexus could not generate a response. The prompt was blocked. Reason: ${blockReason}.`
            });
        }
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Failed to generate content due to a system error." });
    }
};

module.exports = { nexusBotController };