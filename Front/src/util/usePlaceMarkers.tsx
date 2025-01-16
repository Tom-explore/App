import { useMemo, useCallback } from 'react';
import L from 'leaflet';
import { Place, PlaceType } from '../types/PlacesInterfaces';
import { getEmoji } from './IconFinder';

export function usePlacesMarkers(places: Place[]) {
  const sortedPlaces = useMemo(() => {
    const placeTypeOrder: PlaceType[] = [
      PlaceType.TOURIST_ATTRACTION,
      PlaceType.HOTEL,
      PlaceType.RESTAURANT_BAR,
    ];
    return [...places].sort((a, b) => {
      return (
        placeTypeOrder.indexOf(a.placeType) - placeTypeOrder.indexOf(b.placeType)
      );
    });
  }, [places]);

  const averageReviewCount = useMemo(() => {
    if (places.length === 0) return 0;
    const total = places.reduce(
      (sum, place) => sum + (place.reviews_google_count || 0),
      0
    );
    return total / places.length;
  }, [places]);

  const getScaleLevel = useCallback(
    (reviewCount: number): number => {
      if (averageReviewCount === 0) return 1;

      const minReviews = Math.min(...places.map((p) => p.reviews_google_count || 0));
      const maxReviews = Math.max(...places.map((p) => p.reviews_google_count || 0));

      if (maxReviews === minReviews) {
        return 10;
      }

      const scale = ((reviewCount - minReviews) / (maxReviews - minReviews)) * 19 + 1;
      return Math.round(scale);
    },
    [averageReviewCount, places]
  );

  const calculateSize = useCallback((scale: number): [number, number] => {
    const minSize = 60;
    const maxSize = 220;

    const size = minSize + ((scale - 1) / 19) * (maxSize - minSize);
    const finalSize = Math.max(minSize, Math.min(size, maxSize));

    return [finalSize, finalSize];
  }, []);

  // Nouvelle fonction pour calculer la taille de l'emoji
  const calculateEmojiSize = useCallback((containerSize: number): number => {
    // L'emoji prendra 60% de la taille du conteneur
    return Math.round(containerSize * 0.6);
  }, []);

  const createClusterIcon = useCallback(
    (cluster: any) => {
      const markers = cluster.getAllChildMarkers() as L.Marker[];

      if (markers.length === 0) {
        const clusterIconHTML = `<div class="custom-cluster-icon">0</div>`;
        return L.divIcon({
          html: clusterIconHTML,
          className: 'custom-cluster',
          iconSize: L.point(60, 60, true),
          iconAnchor: [30, 30],
        });
      }

      const bestPlace = markers
        .map((marker: any) => marker.place as Place | undefined)
        .filter(
          (p): p is Place =>
            p != null && p.reviews_google_count !== undefined && p.reviews_google_count !== null
        )
        .sort(
          (a, b) =>
            (b.reviews_google_count || 0) - (a.reviews_google_count || 0)
        )[0];

      if (!bestPlace || bestPlace.reviews_google_count === undefined || bestPlace.reviews_google_count === null) {
        return L.divIcon({
          html: `<div class="custom-cluster-icon">0</div>`,
          className: 'custom-cluster',
          iconSize: L.point(60, 60, true),
          iconAnchor: [30, 30],
        });
      }

      const count = cluster.getChildCount();
      const scaleLevel = getScaleLevel(bestPlace.reviews_google_count);
      const [finalSize] = calculateSize(scaleLevel);
      const zIndex = scaleLevel * 10;
      const emojiSize = calculateEmojiSize(finalSize);

      let clusterContent: string;
      if (bestPlace.placeType === PlaceType.RESTAURANT_BAR) {
        const emoji = getEmoji(bestPlace.categories, bestPlace.attributes);
        clusterContent = `
          <div
              class="custom-cluster-icon"
              style="
                  width: ${finalSize}px;
                  height: ${finalSize}px;
                  z-index: ${zIndex};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  background: white;
                  border-radius: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              "
          >
              <span 
                class="icon-finder"
                style="
                  font-size: ${emojiSize}px;
                  line-height: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >${emoji}</span>
              <span
                  style="
                      position: absolute;
                      bottom: 5px;
                      right: 5px;
                      background: rgba(255,255,255,0.8);
                      border-radius: 50%;
                      padding: 2px 5px;
                      font-size: 0.8rem;
                  "
              >
                  ${count}
              </span>
          </div>
        `;
      } else {
        const imageUrl =
          bestPlace.images && bestPlace.images.length > 0 && bestPlace.images[0].slug
            ? `https://api.allorigins.win/raw?url=https://lh3.googleusercontent.com/p/${bestPlace.images[0].slug}`
            : '/assets/img/compass.png';

        clusterContent = `
          <div
              class="custom-cluster-icon"
              style="
                  width: ${finalSize}px;
                  height: ${finalSize}px;
                  z-index: ${zIndex};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
              "
          >
              <img
                  src="${imageUrl}"
                  alt="${bestPlace?.name_original || bestPlace?.slug}"
                  style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 50%;
                      border: 2px solid white;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  "
              />
              <span
                  style="
                      position: absolute;
                      bottom: 5px;
                      right: 5px;
                      background: rgba(255,255,255,0.8);
                      border-radius: 50%;
                      padding: 2px 5px;
                      font-size: 0.8rem;
                  "
              >
                  ${count}
              </span>
          </div>
        `;
      }

      return L.divIcon({
        html: clusterContent,
        className: 'custom-cluster',
        iconSize: L.point(finalSize, finalSize, true),
        iconAnchor: [finalSize / 2, finalSize / 2],
      });
    },
    [getScaleLevel, calculateSize, calculateEmojiSize]
  );

  return {
    sortedPlaces,
    averageReviewCount,
    getScaleLevel,
    calculateSize,
    calculateEmojiSize,
    createClusterIcon,
  };
}
