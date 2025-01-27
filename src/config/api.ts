const isDevelopment = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
    baseUrl: isDevelopment 
        ? 'http://localhost:3001/api'
        : 'https://conexia.conexcondo.com.br/api',
    minioEndpoint: 'https://newapi.conexcondo.com.br'
};
