import React, { useState, useEffect } from 'react';

function AutocompleteInput() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (inputValue.length === 0) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(inputValue)}`);
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [inputValue]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type to search..."
        style={{ width: '100%', padding: '8px' }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            border: '1px solid #ccc',
            backgroundColor: 'white',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            maxHeight: '150px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{ padding: '8px', cursor: 'pointer' }}
              onMouseDown={(e) => e.preventDefault()} // Prevent input blur on click
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteInput;
