const { PinataSDK } = require('pinata');
const axios = require('axios');

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.PINATA_GATEWAY,
});

const uploadDataset = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded. Please select a dataset file.'
            });
        }

        console.log('File received:', {
            filename: req.file.originalname,
            size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
            mimetype: req.file.mimetype
        });

        const upload = await pinata.upload.buffer(req.file.buffer, {
            name: req.file.originalname,
            mimeType: req.file.mimetype
        });

        res.status(201).json({
            success: true,
            message: 'Dataset uploaded to IPFS successfully',
            data: {
                id: upload.id,
                cid: upload.cid,
                filename: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                uploadedAt: upload.created_at,
                urls: {
                    gateway: `https://${process.env.PINATA_GATEWAY}/ipfs/${upload.cid}`,
                    ipfs: `https://ipfs.io/ipfs/${upload.cid}`,
                    cloudflare: `https://cloudflare-ipfs.com/ipfs/${upload.cid}`
                }
            }
        });

    } catch (error) {
        console.error('Upload error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to upload dataset to IPFS',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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

        // Find the file by CID
        const files = await pinata.listFiles().cid(cid);

        if (!files.files || files.files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Dataset not found in your pinned files'
            });
        }

        const fileId = files.files[0].id;

        await pinata.files.delete([fileId]);

        res.status(200).json({
            success: true,
            message: `Dataset with CID ${cid} has been deleted`,
            data: {
                cid: cid,
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
