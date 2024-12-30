import React, { useState, useEffect } from 'react';
import '../styles/components/SearchBar.css'

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
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
        placeholder={placeholder}
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
