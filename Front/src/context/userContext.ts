// import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// interface User {
//     login: string;
//     userId: number;
//     admin: boolean;
// }

// interface UserContextType {
//     user: User | null;
//     setUser: (user: User | null) => void;
//     checkCookie: () => boolean;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const [user, setUser] = useState<User | null>(null);

//     return (
//         <UserContext.Provider value={{ user, setUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export const useUser = (): UserContextType => {
//     const context = useContext(UserContext);
//     if (context === undefined) {
//         throw new Error('useUser must be used within a UserProvider');
//     }
//     return context;
// };