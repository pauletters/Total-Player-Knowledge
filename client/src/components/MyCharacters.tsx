import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const MyCharacters: React.FC = () => {
  interface Character {
    name: string;
    // Add other character properties here
  }

  const [characters] = useState<Character[]>([
    // Your existing characters
  ]);
  const navigate = useNavigate();

  const handleCreateCharacter = () => {
    // Navigate to the create character route
    navigate('/my-characters/character-creation');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Characters</h1>
        <button 
          onClick={handleCreateCharacter}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
          Create Character
        </button>
      </div>

      {/* List of existing characters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {characters.map((character, index) => (
          <div 
            key={index} 
            className="border rounded p-4 hover:shadow-lg transition-shadow"
          >
            <h2>{character.name}</h2>
            {/* More character details */}
          </div>
        ))}
      </div>

      {/* This will render the CharacterSheet when navigated to /my-characters/create */}
      <Outlet />
    </div>
  );
};

export default MyCharacters;