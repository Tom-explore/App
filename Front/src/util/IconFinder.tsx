import React from 'react';
import { Category, Attribute } from '../types/CategoriesAttributesInterfaces';

interface IconFinderProps {
    categories: Category[];
    attributes: Attribute[];
}

const IconFinder: React.FC<IconFinderProps> = ({ categories, attributes }) => {
    const slugToEmoji = (slug: string): { emoji: string; priority: number } | null => {
        // Mapping des slugs aux émojis avec priorité
        const emojiMapping: Record<string, { emoji: string; priority: number }> = {
            // Catégories principales
            'pizzeria': { emoji: '🍕', priority: 1 },
            'cocktail-bar': { emoji: '🍸', priority: 1 },
            'pub': { emoji: '🍺', priority: 2 },
            'bar': { emoji: '🍹', priority: 3 },
            'restaurant': { emoji: '🍴', priority: 4 },
            'cafe': { emoji: '☕', priority: 5 },
            'fast-food': { emoji: '🍔', priority: 6 },
            'museum': { emoji: '🏛️', priority: 7 },
            'park': { emoji: '🌳', priority: 8 },
            'monument': { emoji: '🗿', priority: 9 },
            'theater': { emoji: '🎭', priority: 10 },
            'zoo': { emoji: '🦁', priority: 11 },
            'aquarium': { emoji: '🐠', priority: 12 },
            'beach': { emoji: '🏖️', priority: 13 },
            'castle': { emoji: '🏰', priority: 14 },
            'brunch-restaurant': { emoji: '🥞', priority: 15 },
            // Attributs
            'vegan': { emoji: '🥦', priority: 16 },
            'vegetarian': { emoji: '🥗', priority: 17 },
            'gluten-free': { emoji: '🥖', priority: 18 },
            'halal': { emoji: 'حلال', priority: 19 },
            'organic': { emoji: '🌾', priority: 20 },
            'wine': { emoji: '🍷', priority: 21 },
            'beer': { emoji: '🍺', priority: 22 },
            'cocktails': { emoji: '🍸', priority: 23 },
            'coffee': { emoji: '☕', priority: 24 },
            'nature': { emoji: '🌿', priority: 25 },
            'art': { emoji: '🎨', priority: 26 },
        };

        return emojiMapping[slug] || null;
    };

    const findIcon = (): string => {
        let highestPriority = Infinity;
        let selectedEmoji = '❓'; // Icône par défaut

        // Parcours des catégories
        for (const category of categories) {
            const emojiData = slugToEmoji(category.slug);
            if (emojiData && emojiData.priority < highestPriority) {
                highestPriority = emojiData.priority;
                selectedEmoji = emojiData.emoji;
            }
        }

        // Parcours des attributs (après les catégories)
        for (const attribute of attributes) {
            const emojiData = slugToEmoji(attribute.slug);
            if (emojiData && emojiData.priority < highestPriority) {
                highestPriority = emojiData.priority;
                selectedEmoji = emojiData.emoji;
            }
        }

        return selectedEmoji;
    };

    const icon = findIcon();

    return <span style={{ fontSize: '1.5rem' }}>{icon}</span>;
};

export default IconFinder;
