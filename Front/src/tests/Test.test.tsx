// import React from "react";
// import { render, screen, fireEvent, cleanup } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import Test from "../pages/Test";

// // Mock d'apiClient pour éviter les appels réels
// jest.mock("../config/apiClient", () => ({
//   get: jest.fn(() =>
//     Promise.resolve({
//       data: [{ id: 1, name: "Test Data" }],
//     })
//   ),
// }));
// afterEach(() => {
//     jest.clearAllMocks();
//     cleanup();
//   });
// describe("Test Component", () => {
//   it("renders the component with the title", () => {
//     render(<Test />);
//     expect(screen.getByText("API Fetch Component")).toBeInTheDocument();
//   });

//   it("renders the list of endpoints as buttons", () => {
//     render(<Test />);
//     // Utiliser getAllByText pour les boutons basés sur le texte
//     const buttons = screen.getAllByText(/^Fetch /); // Tous les boutons commençant par "Fetch"
//     expect(buttons.length).toBeGreaterThan(0);
//   });

// });
