interface CarouselInputConfig {
    categorySlug: string;
    templateIndex: number;
}

interface CarouselConfig {
    categorySlug: string;
    title: (cityName: string, categoryName: string, languageCode: string) => string;
}

interface PlaceCarouselConfig {
    [citySlug: string]: CarouselConfig[];
}
const titleTemplates: Record<string, string[]> = {
    fr: [
        "Les meilleurs {categoryName} à {cityName}",
        "Top 10 des {categoryName} à visiter à {cityName}",
        "Les {categoryName} incontournables à {cityName}"
    ],
    en: [
        "The best {categoryName} in {cityName}",
        "Top 10 {categoryName} to visit in {cityName}",
        "Must-see {categoryName} in {cityName}"
    ],
};

const defaultLanguage = 'fr';

const generateTitle = (
    cityName: string,
    categoryName: string,
    languageCode: string,
    templateIndex: number
): string => {
    const templates = titleTemplates[languageCode] || titleTemplates[defaultLanguage];
    const template = templates[templateIndex % templates.length];
    return template
        .replace("{categoryName}", categoryName)
        .replace("{cityName}", cityName);
};

const touristAttractionConfig: CarouselInputConfig = {
    categorySlug: 'tourist-attraction',
    templateIndex: 2,
};

const createCarouselConfig = (configs: CarouselInputConfig[]): CarouselConfig[] => {
    const combinedConfigs = [...configs, touristAttractionConfig];
    return combinedConfigs.map(({ categorySlug, templateIndex }) => ({
        categorySlug,
        title: (cityName: string, categoryName: string, languageCode: string) =>
            generateTitle(cityName, categoryName, languageCode, templateIndex),
    }));
};

const placeCarouselConfig: PlaceCarouselConfig = {
    vannes: createCarouselConfig([
        { categorySlug: 'creperie', templateIndex: 0 },
        { categorySlug: 'seafood-restaurant', templateIndex: 1 },
    ]),
    naples: createCarouselConfig([
        { categorySlug: 'pizza-restaurant', templateIndex: 0 },
        { categorySlug: 'pasta-shop', templateIndex: 1 },
        { categorySlug: 'cafe', templateIndex: 0 },
    ]),
    dublin: createCarouselConfig([
        { categorySlug: 'pub', templateIndex: 0 },
        { categorySlug: 'restaurant', templateIndex: 1 },
    ]),
    default: createCarouselConfig([
        { categorySlug: 'brunch-restaurant', templateIndex: 0 },
        { categorySlug: 'bar', templateIndex: 1 },
        { categorySlug: 'restaurant', templateIndex: 0 },
    ]),
};

export default placeCarouselConfig;
