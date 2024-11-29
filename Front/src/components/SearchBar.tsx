import React, { useState, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  const clearQuery = () => {
    setQuery('');
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Rechercher une ville... On l'a sûrement !"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button className="clear-button" onClick={clearQuery}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
