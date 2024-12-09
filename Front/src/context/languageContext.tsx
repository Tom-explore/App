import React, { createContext, useContext, useState, ReactNode } from 'react';
import languages from '../data/languages.json';
import { Language } from '../types/TranslationsInterfaces';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isSelectorChange: boolean;
  setSelectorChange: (value: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [isSelectorChange, setSelectorChange] = useState(false);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, isSelectorChange, setSelectorChange }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
