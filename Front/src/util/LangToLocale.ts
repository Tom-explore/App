
const LangToLocale = (langCode: string): string => {
    // Mappage des codes de langue ou de pays à deux lettres vers les locales : calendar 
    const mapping: { [key: string]: string } = {
        'FR': 'fr-FR',
        'ES': 'es-ES',
        'EN': 'en-US',
        'DE': 'de-DE',
        'IT': 'it-IT',
        'PT': 'pt-PT',
        'RU': 'ru-RU',
        'JA': 'ja-JP',
        'ZH': 'zh-CN',
        'KO': 'ko-KR',
        'NL': 'nl-NL',
        'BE': 'nl-BE',
        'GR': 'el-GR',
        'RO': 'ro-RO',
        'HU': 'hu-HU',
        'DK': 'da-DK',
        'PL': 'pl-PL',
        'IE': 'en-IE',
        'HR': 'hr-HR',
        'GB': 'en-GB',
        'SE': 'sv-SE',
        'EE': 'et-EE',
        'AT': 'de-AT',
        'CZ': 'cs-CZ',
        'TR': 'tr-TR',
    };

    const upperLangCode = langCode.toUpperCase();

    return mapping[upperLangCode] || 'en-US';
};

export default LangToLocale;
