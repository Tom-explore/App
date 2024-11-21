import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import apiClient from "../config/apiClient";

const Test: React.FC = () => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ [key: string]: string | null }>({});
  const [data, setData] = useState<{ [key: string]: any[] }>({});

  const fetchData = async (endpoint: string) => {
    setLoading((prev) => ({ ...prev, [endpoint]: true }));
    setError((prev) => ({ ...prev, [endpoint]: null }));

    try {
      const response = await apiClient.get(`/${endpoint}`);
      setData((prev) => ({ ...prev, [endpoint]: response.data }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        [endpoint]: "An error occurred while fetching data",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [endpoint]: false }));
    }
  };

  const endpoints = [
    "attribute",
    "category",
    "placeattribute",
    "placecategory",
    "city",
    "country",
    "partner",
    "place",
    "hotel",
    "openinghours",
    "placeimg",
    "restaurantbar",
    "touristattraction",
    "txattribute",
    "txcategory",
    "txcategorycitylang",
    "txcity",
    "txcountry",
    "txplace",
    "txpost",
    "txpostbloc",
    "txpostimg",
    "user",
    "placesaddedbyuser",
    "userplaceslike",
    "userplacespreference",
    "people",
    "trip",
    "tripattribute",
    "tripcategoryfilter",
    "tripcomposition",
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>API Fetch Component</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ background: "#f0f0f0", minHeight: "100vh" }}>
      <IonGrid>
          {endpoints.map((endpoint) => (
            <IonRow key={endpoint} className="ion-margin-bottom">
              <IonCol size="12" sizeMd="6" offsetMd="3">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{`Fetch ${endpoint}`}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonButton
                      expand="block"
                      color="primary"
                      onClick={() => fetchData(endpoint)}
                    >
                      {loading[endpoint] ? <IonSpinner /> : `Fetch ${endpoint}`}
                    </IonButton>
                    {error[endpoint] && (
                      <IonText color="danger">
                        <p>{error[endpoint]}</p>
                      </IonText>
                    )}
                    {data[endpoint] && data[endpoint].length > 0 && (
                      <div>
                        <IonText color="success">
                          <h3>Data:</h3>
                        </IonText>
                        <pre
                          style={{
                            fontSize: "0.9em",
                            backgroundColor: "#f8f8f8",
                            padding: "10px",
                            borderRadius: "5px",
                            overflowX: "auto",
                          }}
                        >
                          {JSON.stringify(data[endpoint], null, 2)}
                        </pre>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Test;
