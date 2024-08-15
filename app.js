import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';  
import dotenv from 'dotenv';
import { s3Uploadv2, s3Uploadv3 } from './s3service.js';  // Import de la fonction de téléchargement S3

dotenv.config();  // Chargement des variables d'environnement

const app = express();
const port = process.env.PORT || 8000;  // Utilisation de la variable d'environnement pour le port

// Configuration de la mémoire de stockage avec multer
const storage = multer.memoryStorage();

// Filtre pour vérifier que le fichier est une image
const fileFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] === 'image') {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));  // Erreur si le fichier n'est pas une image
    }
};

// Initialisation de multer avec des limites et des filtres de fichiers
const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 10000000, files: 2 }  // Limite de taille et de nombre de fichiers
});

// Route pour gérer les téléchargements de fichiers
/* app.post('/upload', upload.array('file', 10), async (req, res) => { 
    try {
        const file = req.files[0];
        console.log('File:', file);
        const result = await s3Uploadv2(file);
        res.json({ status: 'success', result });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ status: 'error', message: 'Une erreur est survenue lors du téléchargement.' });
    }
}); */


app.post('/upload', upload.array('file', 10), async (req, res) => { 
    try {
        const file = req.files[0];
        console.log('File:', file);
        const result = await s3Uploadv3(file);
        console.log(result);
        
        res.json({ status: 'success', result });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ status: 'error', message: 'Une erreur est survenue lors du téléchargement.' });
    }
});
// Middleware pour gérer les erreurs de multer et autres
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) { 
        // Gestion des erreurs spécifiques à multer
        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                res.status(400).json({ message: 'Le fichier est trop volumineux.' });
                break;
            case 'LIMIT_FILE_COUNT':
                res.status(400).json({ message: 'Le nombre de fichiers est trop élevé.' });
                break;
            case 'LIMIT_FIELDS':
                res.status(400).json({ message: 'Le nombre de champs est trop élevé.' });
                break;
            case 'LIMIT_PARTS':
                res.status(400).json({ message: 'Le nombre de parties est trop élevé.' });
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                res.status(400).json({ message: 'Type de fichier non supporté.' });
                break;
            default:
                res.status(500).json({ message: 'Erreur de téléchargement inconnue.' });
                break;
        }
    } else if (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Une erreur inattendue est survenue.' });
    } else {
        next();
    }
});

// Démarrage du serveur
app.listen(port, () => console.log(`Écoute sur le port ${port}`));