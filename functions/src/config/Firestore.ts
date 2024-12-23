import * as admin from "firebase-admin";
import * as path from "path";

// Chemin vers le fichier serviceAccountKey.json
const serviceAccountPath = path.resolve(__dirname, "../../serviceAccountKey.json");
console.log("Chemin du fichier serviceAccountKey.json :", serviceAccountPath);

// Chargement du fichier JSON
let serviceAccount;
try {
    serviceAccount = require(serviceAccountPath);

} catch (error) {
    console.error("Erreur lors du chargement du fichier serviceAccountKey.json :", error);
    throw new Error("Impossible de charger les credentials Firebase Admin.");
}

// Validation des champs requis
if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
    console.error("Certains champs nécessaires sont manquants dans le fichier de configuration :", {
        project_id: serviceAccount.project_id,
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key ? "Présent" : "Absent",
    });
    throw new Error("Configuration Firebase Admin invalide !");
}

// Initialisation de Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Export de Firestore pour utilisation
const firestore = admin.firestore();

console.log("Firebase Admin initialisé avec succès !");
export { firestore };
