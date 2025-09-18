const crypto = require('crypto');
const User = require('../models/User');

function normalizePem(str) {
    return String(str).trim().replace(/\r\n/g, '\n').replace(/\\n/g, '\n');
}

function looksLikePublicPem(pem) {
    return pem.startsWith('-----BEGIN PUBLIC KEY-----') && pem.endsWith('-----END PUBLIC KEY-----');
}

function validateRsaPublicKey(pem) {
    try {
        crypto.publicEncrypt({ key: pem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from('test'));
        return true;
    } catch {
        return false;
    }
}

const addPublicKeyController = async (req, res) => {
    try {
        const { userId, publicKey } = req.body;

        if (!userId || !publicKey) {
            return res.status(400).json({ error: 'userId and publicKey are required' });
        }

        // OPTIONAL: enforce that the authenticated user matches userId
        if (req.user?.id !== userId) return res.status(403).json({ error: 'Forbidden' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const normalized = normalizePem(publicKey);
        if (!looksLikePublicPem(normalized)) {
            return res.status(400).json({ error: 'Invalid PEM: missing public key headers/footers' });
        }

        // Optional strong validation to catch OpenSSL decoder issues early
        if (!validateRsaPublicKey(normalized)) {
            return res.status(400).json({ error: 'Invalid RSA public key or unsupported format' });
        }

        user.publicKeyPEM = normalized;
        await user.save();

        return res.status(200).json({ message: 'Public key added successfully' });
    } catch (error) {
        console.error('Error adding public key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getPublicKeyController = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user id missing in token' });
        }

        const user = await User.findById(userId).select('publicKeyPEM').lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!user.publicKeyPEM) {
            return res.status(404).json({ error: 'Public key not set' });
        }

        return res.status(200).json({
            userId,
            publicKeyPEM: user.publicKeyPEM
        });
    } catch (err) {
        console.error('Error fetching public key:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { addPublicKeyController, getPublicKeyController };