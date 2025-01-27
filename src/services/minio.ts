import * as Minio from 'minio';

const minioConfig = {
    endPoint: 'newapi.conexcondo.com.br',
    port: 443,
    useSSL: true,
    accessKey: '5nZfsMSBVWH2XKSYK0md',
    secretKey: 'Dkv3HxXnBvbDwW35DMEMg4i9gRtry6cbh2mD78Xp',
    region: 'us-east-1'
};

// Criar cliente MinIO
const minioClient = new Minio.Client(minioConfig);

export interface PresignedUrlParams {
    bucket: string;
    key: string;
    contentType: string;
}

export const generatePresignedUrl = async ({ bucket, key, contentType }: PresignedUrlParams) => {
    try {
        // Gerar URL pré-assinada para upload (válida por 1 hora)
        const presignedUrl = await minioClient.presignedPutObject(
            bucket,
            key,
            60 * 60 // 1 hora em segundos
        );

        return {
            url: presignedUrl,
            bucket,
            key,
            expiresIn: 3600
        };
    } catch (error) {
        console.error('Erro ao gerar URL pré-assinada:', error);
        throw error;
    }
};

export default minioClient;
