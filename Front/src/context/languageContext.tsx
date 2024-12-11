import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import languages from '../data/languages.json';
import { Language } from '../types/TranslationsInterfaces';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isSelectorChange: boolean;
  setSelectorChange: (value: boolean) => void;
  isLanguageLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [isSelectorChange, setSelectorChange] = useState(false);
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  // Ici, on simule le chargement de la langue. Vous pouvez ajuster selon votre logique.
  useEffect(() => {
    // Dès que la langue est positionnée (par exemple depuis l'URL), on peut dire que c'est chargé
    setIsLanguageLoaded(true);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, isSelectorChange, setSelectorChange, isLanguageLoaded }}
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
