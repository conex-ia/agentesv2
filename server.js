import express from 'express';
import cors from 'cors';
import * as Minio from 'minio';

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do cliente MinIO
const minioClient = new Minio.Client({
    endPoint: 'newapi.conexcondo.com.br',
    port: 443,
    useSSL: true,
    accessKey: '5nZfsMSBVWH2XKSYK0md',
    secretKey: 'Dkv3HxXnBvbDwW35DMEMg4i9gRtry6cbh2mD78Xp',
    region: 'us-east-1'
});

// Endpoint para gerar URL pré-assinada
app.post('/api/presign', async (req, res) => {
    try {
        const { bucket, key, contentType } = req.body;

        if (!bucket || !key || !contentType) {
            return res.status(400).json({ 
                error: 'Missing required parameters' 
            });
        }

        // Gerar URL pré-assinada para upload (válida por 1 hora)
        const presignedUrl = await minioClient.presignedPutObject(
            bucket,
            key,
            60 * 60 // 1 hora em segundos
        );

        res.json({
            url: presignedUrl,
            bucket,
            key,
            expiresIn: 3600
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ 
            error: 'Error generating presigned URL',
            details: error.message
        });
    }
});

// Iniciar servidor na porta 3500
const PORT = 3500;
app.listen(PORT, () => {
    console.log(`Servidor presign rodando na porta ${PORT}`);
});
