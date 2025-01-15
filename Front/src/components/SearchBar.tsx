import React, { useState, useEffect } from "react";
import "../styles/components/SearchBar.css";
import { IonSearchbar } from "@ionic/react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  const handleIonChange = (event: CustomEvent) => {
    setQuery(event.detail.value);
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <IonSearchbar
      className={`tex ${isSearchOpen ? "" : "hidden"}`}
      placeholder={placeholder}
      value={query}
      onIonInput={(e) => handleIonChange(e)}
      onIonFocus={() => setIsSearchOpen(true)}
      onIonBlur={() => setIsSearchOpen(false)}
      animated={true}
    ></IonSearchbar>
  );
};

export default SearchBar;
