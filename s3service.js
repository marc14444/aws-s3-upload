import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';

export const s3Uploadv2 = async (file) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });  // Initialisation correcte du service S3

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,  // Assurez-vous que cette variable d'environnement est définie
        Key: `uploads/${uuidv4()}-${file.originalname}`,  // Chemin du fichier dans S3
        Body: file.buffer,  // Utilisation directe du buffer, pas besoin de .toString()
    };

    try {
        return await s3.upload(params).promise();  // Retourne le résultat du téléchargement
    } catch (error) {
        console.error('Erreur lors du téléchargement vers S3:', error);  // Gestion des erreurs
        throw error;  // Relance l'erreur pour être gérée par l'appelant
    }
};

export const s3Uploadv3 = async (file)=>{
    const s3client = new S3Client();

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${uuidv4()}-${file.originalname}`,
        Body: file.buffer,
    };
    return await s3client.send(new PutObjectCommand(params));
}
