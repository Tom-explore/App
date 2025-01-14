// src/util/IconFinder.ts

import React from 'react';
import { Category, Attribute } from '../types/CategoriesAttributesInterfaces';

// Mapping of slugs to emojis with priority
const EMOJI_MAPPING: Record<string, { emoji: string; priority: number }> = {
    // Main categories
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
    // Attributes
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

/**
 * Utility function to get the appropriate emoji based on categories and attributes.
 * @param categories - Array of category objects.
 * @param attributes - Array of attribute objects.
 * @returns The selected emoji as a string.
 */
export const getEmoji = (categories: Category[], attributes: Attribute[]): string => {
    let highestPriority = Infinity;
    let emoji = '❓'; // Default icon

    // Combine categories and attributes, prioritizing categories first
    const combined = [...categories, ...attributes];

    for (const item of combined) {
        const data = EMOJI_MAPPING[item.slug];
        if (data && data.priority < highestPriority) {
            highestPriority = data.priority;
            emoji = data.emoji;

            // If the highest priority is achieved, stop the loop
            if (highestPriority === 1) break;
        }
    }

    return emoji;
};

// Optional: Keep the IconFinder component if needed elsewhere
interface IconFinderProps {
    categories: Category[];
    attributes: Attribute[];
}

const IconFinder: React.FC<IconFinderProps> = ({ categories, attributes }) => {
    const selectedEmoji = getEmoji(categories, attributes);
    return <span className="icon-finder">{selectedEmoji}</span>;
};

export default React.memo(IconFinder);
