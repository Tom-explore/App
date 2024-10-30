import * as functions from "firebase-functions/v2";
import express, { Request, Response } from "express";
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getDataConnect } from 'firebase-admin/data-connect';

// Initialize Firebase Admin SDK
const firebaseAdminApp = initializeApp({
  credential: applicationDefault(),
  projectId: "tomexplore-c1c71"
});

// Initialize Data Connect with elevated privileges
const dataConnect = getDataConnect({
  serviceId: 'dataconnect',
  location: 'europe-west3'
});

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Define endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!!!");
});

app.get("/test-connection", async (req: Request, res: Response) => {
  try {
    // Corrected GraphQL query for listing users
    const usersQuery = `
      query {
        users {
          uid
          name
          address
        }
      }
    `;
    
    const response = await dataConnect.executeGraphqlRead(usersQuery);
    res.status(200).json({ users: response.data });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({ error: "Erreur de connexion à la base de données" });
  }
});

app.post("/add-user", async (req: Request, res: Response) => {
  const { uid, name, address } = req.body;

  // Define the GraphQL mutation for inserting a user without selection fields
  const addUserMutation = `
    mutation {
      user_insert(data: {
        uid: "${uid}",
        name: "${name}",
        address: "${address}"
      })
    }
  `;

  try {
    // Execute the mutation using Data Connect
    await dataConnect.executeGraphql(addUserMutation);
    res.status(200).json({ message: "User added successfully." });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});


// Export the API as a Firebase function
export const api = functions.https.onRequest(
  {
    region: "europe-west3"
  },
  app
);
