// src/controllers/FirestoreController.ts

import { Request, Response } from 'express';
import { firestore } from '../../config/Firestore';

class FirestoreController {
    static async writeHelloWorld(req: Request, res: Response): Promise<void> {
        try {
            console.log("Début de l'écriture dans Firestore");
            const collectionRef = firestore.collection('tomexplore');

            console.log("Référence à la collection obtenue :", collectionRef.id);
            const docRef = await collectionRef.add({
                message: 'hello world',
                timestamp: new Date(),
            });

            console.log("Document ajouté avec succès :", docRef.id);
            res.status(200).json({
                success: true,
                message: 'Document ajouté avec succès',
                documentId: docRef.id,
            });
        } catch (error) {
            console.error("Erreur lors de l'écriture Firestore :", error);
            res.status(500).json({
                success: false,
                error: 'Erreur interne du serveur',
            });
        }
    }
}


export default FirestoreController;
