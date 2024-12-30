// src/config/cityCarouselConfig.ts

interface CarouselConfig {
    categorySlug: string;
    title: (cityName: string, categoryName: string, languageCode: string) => string;
}

interface PlaceCarouselConfig {
    [citySlug: string]: CarouselConfig[];
}

const placeCarouselConfig: PlaceCarouselConfig = {
    vannes: [
        {
            categorySlug: 'creperie',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les meilleures ${categoryName} à ${cityName}`;
                    case 'en':
                        return `The best ${categoryName} in ${cityName}`;
                    default:
                        return `Les meilleures ${categoryName} à ${cityName}`;
                }
            },
        },
        {
            categorySlug: 'seafood-restaurant',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                    case 'en':
                        return `The best ${categoryName} in ${cityName}`;
                    default:
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                }
            },
        },
        {
            categorySlug: 'tourist-attraction',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les attractions touristiques à ${cityName}`;
                    case 'en':
                        return `Tourist attractions in ${cityName}`;
                    default:
                        return `Les attractions touristiques à ${cityName}`;
                }
            },
        },
    ],
    naples: [
        {
            categorySlug: 'pizza-restaurant',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les meilleures ${categoryName} à ${cityName}`;
                    case 'en':
                        return `The best ${categoryName} in ${cityName}`;
                    default:
                        return `Les meilleures ${categoryName} à ${cityName}`;
                }
            },
        },
        {
            categorySlug: 'pasta-shop',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                    case 'en':
                        return `The best ${categoryName} in ${cityName}`;
                    default:
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                }
            },
        },
        {
            categorySlug: 'cafe',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                    case 'en':
                        return `The best ${categoryName} in ${cityName}`;
                    default:
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                }
            },
        },
        {
            categorySlug: 'tourist-attraction',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les attractions touristiques à ${cityName}`;
                    case 'en':
                        return `Tourist attractions in ${cityName}`;
                    default:
                        return `Les attractions touristiques à ${cityName}`;
                }
            },
        },
    ],
    dublin: [
        {
            categorySlug: 'pub',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                    case 'en':
                        return `The best ${categoryName} in ${cityName}`;
                    default:
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                }
            },
        },
        {
            categorySlug: 'restaurant',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                    case 'en':
                        return `The best ${categoryName} in ${cityName}`;
                    default:
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                }
            },
        },
        {
            categorySlug: 'tourist-attraction',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les attractions touristiques à ${cityName}`;
                    case 'en':
                        return `Tourist attractions in ${cityName}`;
                    default:
                        return `Les attractions touristiques à ${cityName}`;
                }
            },
        },
    ],
    default: [
        {
            categorySlug: 'brunch-restaurant',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                    case 'en':
                        return `The best ${categoryName} in ${cityName}`;
                    default:
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                }
            },
        },
        {
            categorySlug: 'bar',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                    case 'en':
                        return `The best ${categoryName} in ${cityName}`;
                    default:
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                }
            },
        },
        {
            categorySlug: 'restaurant',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                    case 'en':
                        return `The best ${categoryName} in ${cityName}`;
                    default:
                        return `Les meilleurs ${categoryName} à ${cityName}`;
                }
            },
        },
        {
            categorySlug: 'tourist-attraction',
            title: (cityName: string, categoryName: string, languageCode: string) => {
                switch (languageCode) {
                    case 'fr':
                        return `Les attractions touristiques à ${cityName}`;
                    case 'en':
                        return `Tourist attractions in ${cityName}`;
                    default:
                        return `Les attractions touristiques à ${cityName}`;
                }
            },
        },
    ],
};

export default placeCarouselConfig;
