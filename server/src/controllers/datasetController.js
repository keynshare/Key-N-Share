const stream = require('stream');
const pinataSDK = require('@pinata/sdk');

const pinata = new pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_KEY
);

const uploadDataset = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file provided" });
    }

    // Convert buffer → stream so Pinata accepts it
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    const options = {
        pinataMetadata: { name: req.file.originalname },
        pinataOptions: { cidVersion: 1 }
    };

    try {
        const result = await pinata.pinFileToIPFS(bufferStream, options);

        res.status(201).json({
            success: true,
            message: 'Dataset uploaded to IPFS successfully',
            data: {
                cid: result.IpfsHash,
                size: req.file.size,
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                timestamp: result.Timestamp,
                urls: {
                    gateway: `https://${process.env.PINATA_GATEWAY}/ipfs/${result.IpfsHash}`,
                    ipfs: `https://ipfs.io/ipfs/${result.IpfsHash}`,
                    cloudflare: `https://cloudflare-ipfs.com/ipfs/${result.IpfsHash}`
                }
            }
        });
    } catch (error) {
        console.error("Pinata error:", error);
        res.status(500).json({
            success: false,
            message: "IPFS upload failed",
            error: error.message
        });
    }
};


const deleteDataset = async (req, res) => {
    try {
        const { cid } = req.params;

        // Validate CID format
        if (!cid || (!cid.startsWith('Qm') && !cid.startsWith('baf'))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid CID format'
            });
        }

        // Unpin directly by CID
        await pinata.unpin(cid);

        res.status(200).json({
            success: true,
            message: `Dataset with CID ${cid} has been deleted`,
            data: {
                cid,
                deletedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Delete dataset error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to delete dataset',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
;

const getDatasetByCID = async (req, res) => {
    try {
        const { cid } = req.params;

        // Validate CID format
        if (!cid || (!cid.startsWith('Qm') && !cid.startsWith('baf'))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid CID format'
            });
        }

        // Optional: Verify file exists (quick HEAD request)
        try {
            const gatewayUrl = `https://${process.env.PINATA_GATEWAY}/ipfs/${cid}`;
            await axios.head(gatewayUrl, { timeout: 5000 });
        } catch (error) {
            if (error.response?.status === 404) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found on IPFS network'
                });
            }
        }

        // Return direct URLs
        res.json({
            success: true,
            message: 'File URLs retrieved successfully',
            data: {
                cid: cid,
                downloadUrls: {
                    primary: `https://${process.env.PINATA_GATEWAY}/ipfs/${cid}`,
                    backup: `https://ipfs.io/ipfs/${cid}`,
                    cloudflare: `https://cloudflare-ipfs.com/ipfs/${cid}`
                },
                // For frontend convenience
                directDownload: `https://${process.env.PINATA_GATEWAY}/ipfs/${cid}?download=true`
            }
        });

    } catch (error) {
        console.error('Get dataset error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to get dataset URLs',
            error: error.message
        });
    }
};

module.exports = {
    uploadDataset,
    deleteDataset,
    getDatasetByCID
};
