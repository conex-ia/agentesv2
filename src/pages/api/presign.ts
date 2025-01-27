import { NextApiRequest, NextApiResponse } from 'next';
import { generatePresignedUrl } from '../../services/minio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { bucket, key, contentType } = req.body;

        if (!bucket || !key || !contentType) {
            return res.status(400).json({ 
                error: 'Missing required parameters' 
            });
        }

        const presignedUrl = await generatePresignedUrl({
            bucket,
            key,
            contentType
        });

        res.status(200).json(presignedUrl);
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ 
            error: 'Error generating presigned URL',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
