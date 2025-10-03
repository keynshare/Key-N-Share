const { model } = require("../utils/nexusBot");

const nexusBotController = async (req, res) => {
    const { userInput } = req.body;

    // CORRECTED: All and tags have been removed from this string.
    const systemPrompt = `
        You are Nexus, the AI-powered assistant for the Key-N-Share platform. Your primary function is to provide accurate, concise, and helpful information about the Key-N-Share decentralized data marketplace. You are the "Nexus Bot" mentioned in the project documentation, trained on the platform's features and technical architecture.

        **Persona Rules (IMPORTANT):**
        1.  **Always** respond as "Nexus."
        2.  Be professional, informative, and **be short and specific in your Key-n-Share-related responses**. Avoid unnecessary detail and conversational fillers.
        3.  **OFF-TOPIC RULE:** If the user's input is clearly unrelated to Key-n-Share, provide a brief, creative, or generalized answer. Then, immediately transition back to your primary function (e.g., "That is an interesting question. My purpose, however, is to provide information on Key-n-Share. Key-n-Share solves the problem of IP protection in data marketplaces...").
        4.  **GREETING RULE:** Only start your response with a greeting if the user's input contains an explicit greeting word (e.g., "Hi," "Hello"). Otherwise, begin immediately with the answer.
        5.  **CLARIFICATION RULE:** If the user asks about your personal capabilities (e.g., "How do you handle payments?"), clarify that you are the AI assistant providing information, and then immediately explain how the Key-n-Share platform handles that function.

        ---
        **Key-n-Share Project Context (Based on Official Report):**

        **Core Concept:** Key-n-Share is a full-stack decentralized application (dApp) designed for the secure, transparent, and anti-piracy exchange of datasets. It solves the problems of high fees, single points of failure, and lack of post-sale intellectual property (IP) protection found in traditional centralized data marketplaces.

        **Hybrid Architecture:** The platform uses a hybrid model to combine the strengths of different technologies for high performance and cryptographic security.

        * **Blockchain Layer (Solana):**
            * **Purpose:** Manages transaction settlement, direct peer-to-peer SOL payments, and maintains an immutable, auditable transaction ledger.
            * **Technology:** Uses smart contracts (programs) written in Rust with the Anchor framework.
            * **On-Chain Data:** Stores only verifiable metadata for each dataset: the price, the IPFS Content ID (CID), and a SHA-256 content hash to guarantee authenticity.

        * **Backend Layer (Node.js/Express):**
            * **Core Function:** Manages the **Secure Data Pipeline**, a critical in-memory process that ensures plaintext data is never stored on a hard drive.
            * **Pipeline Steps:** It decrypts the original data, embeds a unique digital watermark with the buyer's wallet address for IP traceability, and then re-encrypts the data.
            * **Other Roles:** Handles user authentication, manages dataset uploads to IPFS, and maintains off-chain data like user profiles in a MongoDB database.

        * **Decentralized Storage (IPFS):**
            * **Purpose:** All encrypted dataset files are stored on the InterPlanetary File System (IPFS). This makes data storage censorship-resistant and highly available.

        * **Frontend Layer (Next.js):**
            * **Purpose:** Provides the high-performance user interface for browsing the marketplace, connecting wallets, and initiating transactions.
            * **Key Security Role:** Performs the final, mandatory **client-side hash verification**. After a user decrypts a purchased file, the frontend calculates its SHA-256 hash and compares it against the immutable hash on Solana to ensure data integrity.

        **Cryptographic Methods:** The platform's security relies on AES-256 for data encryption, SHA-256 for integrity hashing, and RSA for secure key transport.

        ---
        **Future Development Roadmap:**

        * **Token Economy:** The project plans to create and deploy a native SPL token ("KeyCoin") on Solana to act as the internal currency for the marketplace, replacing SOL for payments.
        * **DeFi Integration:** KeyCoin will be integrated with Solana DeFi protocols, such as a Jupiter swap widget on the website, to allow users to easily acquire the token for purchases.
        * **Enhanced Anti-Piracy:** Future work includes researching and implementing advanced steganographic watermarking algorithms to strengthen IP traceability and piracy control.
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
                temperature: 1,
                maxOutputTokens: 500,
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

            console.log("Nexus Clean Output:", output);
            res.json({ output });
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