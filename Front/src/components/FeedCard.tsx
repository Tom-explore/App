/* src/components/FeedCard.tsx */

import React, { useRef, useState } from 'react';
import {
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonLabel,
    IonChip,
    IonItem,
    IonIcon
} from '@ionic/react';
import { pinOutline } from 'ionicons/icons';
import '../styles/components/FeedCard.css';
import { Place } from '../types/PlacesInterfaces';
import { useLanguage } from '../context/languageContext';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import useFilterPlaces from '../util/useFilterPlaces';
import IconFinder from '../util/IconFinder';

interface FeedCardProps {
    place: Place;
}

const MAX_VISIBLE_HASHTAGS = 5;
const MAX_DESCRIPTION_LENGTH = 150; // Définir la longueur maximale de la description affichée initialement

const FeedCard: React.FC<FeedCardProps> = ({ place }) => {
    const swiperRef = useRef<SwiperCore | null>(null);
    const [hashtagsExpanded, setHashtagsExpanded] = useState(false);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);

    const languageID = useLanguage().language.id; // Récupère l'ID de langue du contexte
    const { getTranslation } = useFilterPlaces({
        categories: place.categories,
        attributes: place.attributes,
        onFilterChange: () => { },
        languageID,
        allPlaces: []
    });

    const handleImageClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    // Combiner attributs et catégories en un seul tableau de hashtags
    const hashtags = [
        ...place.attributes.map(attr => ({
            type: 'attribute' as const,
            label: `#${getTranslation(attr.slug, 'attributes')}`
        })),
        ...place.categories.map(cat => ({
            type: 'category' as const,
            label: `#${getTranslation(cat.slug, 'categories')}`
        }))
    ];

    const visibleHashtags = hashtagsExpanded ? hashtags : hashtags.slice(0, MAX_VISIBLE_HASHTAGS);
    const hasMoreHashtags = hashtags.length > MAX_VISIBLE_HASHTAGS;

    const toggleHashtags = () => {
        setHashtagsExpanded(prev => !prev);
    };

    // Gestion de la description avec gestion des valeurs nulles ou indéfinies
    const description = place.description_scrapio ?? ''; // Fournir une chaîne vide par défaut
    const isDescriptionLong = description.length > MAX_DESCRIPTION_LENGTH;
    const visibleDescription = descriptionExpanded
        ? description
        : description.slice(0, MAX_DESCRIPTION_LENGTH) + (isDescriptionLong ? '...' : '');

    const toggleDescription = () => {
        setDescriptionExpanded(prev => !prev);
    };

    return (
        <IonCard className="feed-card horizontal-card">
            {/* -- Colonne gauche : Swiper pour les images -- */}
            <div className="image-container">
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={5}
                    slidesPerView={1.2}
                    pagination={{ clickable: true }}
                    className="modal-photo-slider"
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    {place.images.map((img, index) => (
                        <SwiperSlide key={img.id} className="image-slide">
                            <img
                                loading="lazy"
                                src={`https://lh3.googleusercontent.com/p/${img.slug}`}
                                alt={`${place.translation?.name} - ${img.id}`}
                                className="modal-photo"
                                onClick={() => handleImageClick(index)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* -- Colonne droite : texte, hashtags, description -- */}
            <div className="text-container">
                {/* Titre + Adresse */}
                <IonItem lines="none" className="title-item">
                    <IconFinder categories={place.categories} attributes={place.attributes} />
                    <div>
                        <IonCardTitle>{place.translation?.name}</IonCardTitle>
                        <IonCardSubtitle>
                            <IonIcon icon={pinOutline} /> {place.address}
                        </IonCardSubtitle>
                    </div>
                </IonItem>

                {/* Hashtags */}
                <IonCardContent>
                    <div className="hashtags">
                        {visibleHashtags.map((hashtag, index) => (
                            <IonChip
                                key={`${hashtag.type}-${index}`}
                                color={hashtag.type === 'attribute' ? 'primary' : 'secondary'}
                            >
                                <IonLabel>{hashtag.label}</IonLabel>
                            </IonChip>
                        ))}
                        {hasMoreHashtags && (
                            <IonChip
                                onClick={toggleHashtags}
                                className="more-chip"
                                color="light"
                            >
                                <IonLabel>{hashtagsExpanded ? 'Afficher moins' : '...plus'}</IonLabel>
                            </IonChip>
                        )}
                    </div>
                </IonCardContent>

                {/* Description */}
                {description && ( // Rendre conditionnellement la description uniquement si elle existe
                    <IonCardContent className="description">
                        <p>
                            {visibleDescription}
                            {isDescriptionLong && (
                                <span
                                    className="toggle-description"
                                    onClick={toggleDescription}
                                    role="button"
                                    aria-expanded={descriptionExpanded}
                                    tabIndex={0}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            toggleDescription();
                                        }
                                    }}
                                >
                                    {descriptionExpanded ? ' Lire moins' : ' Lire plus'}
                                </span>
                            )}
                        </p>
                    </IonCardContent>
                )}
            </div>
        </IonCard>
    );
};

export default FeedCard;
