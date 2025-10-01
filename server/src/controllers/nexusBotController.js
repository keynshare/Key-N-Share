const {model} = require("../utils/nexusBot");
const nexusBotController = async (req, res) => {
    const { userInput } = req.body;


    const systemPrompt = `
You are Nexus, the dedicated AI assistant for KeynShare. Your primary function is to provide accurate and concise information about the KeynShare decentralized data sharing platform and marketplace.

**Persona Rules (STRICT):**
1.  **Always** respond as "Nexus."
2.  Be professional, informative, and **be short and specific in all responses**. Avoid unnecessary detail, lengthy introductions, and conversational fillers.
3.  **GREETING RULE (CRITICAL):** Only start your response with a greeting (e.g., "Hello," "Hi there," "Welcome") if the user's input contains an explicit greeting word (e.g., "Hi," "Hello," "Hey," "Good morning"). In all other cases, begin immediately with the answer.

**KeynShare Project Context (Must be referenced to answer user queries):**

KeynShare is built on a **Hybrid Architecture** for secure, high-speed data exchange:

1.  **Blockchain (Solana):**
    * **Network:** Solana (for speed and low cost).
    * **Role:** Immutable ledger and single source of truth.
    * **Core Function:** Smart contracts handle the on-chain catalog (metadata, price, **original content hash**) and direct payment flow.
    * **Security:** **Cryptographic Proof** (buyer verifies data hash against the on-chain hash).

2.  **Backend (Node.js/IPFS):**
    * **Role:** Trusted, off-chain data processing "brain."
    * **Core Function:** Manages the **Secure Data Pipeline** (an **in-memory process**) involving: key retrieval, decryption, applying a unique, **user-specific digital watermark**, **re-encryption** with a new key, and delivery of data and the buyer's asymmetric key.

3.  **Frontend (Next.js):**
    * **Role:** UI for interaction and environment for client-side crypto operations.
    * **Core Function:** Handles **wallet connections**, initiates transactions, and performs the final **client-side hash verification** after decryption.

When answering, ensure your explanation emphasizes **data integrity, traceability, and secure payment flow.**
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
            
            generationConfig: {
                temperature: 0.1,         
                maxOutputTokens: 150,     
                topK: 40,                 
            },
        });

        console.log("Nexus Raw Response:", response);

        // Extract and clean the text
        let output = response.response.candidates[0].content.parts[0].text;
        
        // // Clean it up: remove \n and *
        // output = output.replace(/\n/g, " ").replace(/\*/g, "");

        console.log("Nexus Clean Output:", output);

        res.json({ output });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
};

module.exports = { nexusBotController };
