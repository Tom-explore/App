import React from 'react';
import { useLanguage } from '../context/languageContext';
import { useHistory, useLocation } from 'react-router-dom';
import languages from '../data/languages.json';

const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const history = useHistory();
    const location = useLocation();

    const handleChangeLanguage = (code: string) => {
        console.log('Selected language code:', code);

        const selectedLanguage = languages.find((lang) => lang.code === code);
        if (selectedLanguage && selectedLanguage.code !== language.code) {
            console.log('Updating context and URL...');
            setLanguage(selectedLanguage);

            const currentPath = location.pathname.split('/').slice(2).join('/');
            const newPath = `/${selectedLanguage.code}/${currentPath}`;
            console.log('Navigating to:', newPath);
            history.push(newPath);
        }
    };

    return (
        <div>
            <h2>Langue actuelle : {language.name} ({language.code})</h2>
            <ul>
                {languages.map((lang) => (
                    <li key={lang.id}>
                        <button onClick={() => handleChangeLanguage(lang.code)}>
                            {lang.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LanguageSelector;
