import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { list, listOutline, map, mapOutline } from "ionicons/icons";
import "../styles/components/SwitchMapList.css";

interface SwitchMapListProps {
  currentMode: "list" | "map";
  onSwitch: (mode: "list" | "map") => void;
}

const SwitchMapList: React.FC<SwitchMapListProps> = ({
  currentMode,
  onSwitch,
}) => {
  const isMapMode = currentMode === "map";

  const handleClick = () => {
    onSwitch(isMapMode ? "list" : "map"); // Alterne entre 'list' et 'map'
  };

  return (
    <IonButton
      color="primary"
      // fill="outline"
      // shape="round"
      // size="large"
      onClick={handleClick}
      className={`switch-button ${isMapMode ? "map-mode" : "list-mode"}`}
    >
      <IonIcon
        icon={isMapMode ? list : map}
        className="switch-icon"
      />
    </IonButton>
  );
};

export default SwitchMapList;
