import React from 'react';
import { IonContent, IonText, IonSkeletonText } from '@ionic/react';
import './CityHeader.css';
import Meteo from './Meteo';

interface CityHeaderProps {
    name: string;
    description: string;
    lat: number;
    lng: number;
    countryName: string;
    countryCode: string;
    slug: string;
}

const CityHeader: React.FC<CityHeaderProps> = ({
    name,
    description,
    lat,
    lng,
    countryName,
    countryCode,
    slug,
}) => {
    const placeholderUrl = `/assets/img/${countryCode}/${slug}/main/${slug}-1.jpg`;
    const videoUrl = `/assets/img/${countryCode}/${slug}/main/${slug}-video.mp4`;
    console.log(videoUrl);

    return (
        <IonContent scrollY>
            <div className="city-header">
                <div
                    className="city-header-video-container"
                    style={{
                        backgroundImage: `url(${placeholderUrl})`,
                    }}
                >
                    <video
                        className="city-header-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        key={videoUrl}
                    >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="city-header-box">
                    <div className="city-info">
                        <IonText className="city-name">
                            {name}, {countryName}
                        </IonText>
                        <IonText className="city-description">
                            {description}
                        </IonText>
                    </div>
                    {lat && lng && (
                        <div className="city-meteo">
                            <Meteo lat={lat} lng={lng} />
                        </div>
                    )}
                </div>
            </div>
        </IonContent>
    );
};

export default CityHeader;