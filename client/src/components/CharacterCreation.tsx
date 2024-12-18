import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BasicInfoSection } from './CharacterCreationSections/BasicInfoSection';
import { AttributesSection } from './CharacterCreationSections/AttributesSection';
import { CombatSection } from './CharacterCreationSections/CombatSection';
import { SkillsSection } from './CharacterCreationSections/SkillsSection';
import { CharacterData } from './types';

const initialCharacterState: CharacterData = {
  basicInfo: {
    name: '',
    race: '',
    class: '',
    level: 1,
    background: '',
    alignment: '',
  },
  attributes: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  combat: {
    armorClass: 10,
    hitPoints: 10,
    initiative: 0,
    speed: 30,
  },
  skills: {
    proficiencies: [],
    savingThrows: [],
  },
  equipment: [],
  spells: [],
};

const CharacterSheet: React.FC = () => {
  const [character, setCharacter] = useState<CharacterData>(initialCharacterState);
  const navigate = useNavigate();

  // Handler to update character information
  const handleInputChange = (category: keyof CharacterData, field: string, value: any) => {
    setCharacter(prevCharacter => ({
      ...prevCharacter,
      [category]: {
        ...prevCharacter[category],
        [field]: value
      }
    }));
  };

  // Calculate attribute modifiers
  const calculateModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const handleSaveCharacter = () => {
    // TODO: Implement save functionality (e.g., local storage, API call)
    console.log('Saving character:', character);
    navigate('/my-characters');
  };

  const handleCancelCharacter = () => {
    // Confirm before navigating away
    const confirmCancel = window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.');
    if (confirmCancel) {
      navigate('/my-characters');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Character Sheet</h1>
      
      <BasicInfoSection 
        character={character} 
        onInputChange={handleInputChange} 
      />
      
      <AttributesSection 
        character={character} 
        onInputChange={handleInputChange}
        calculateModifier={calculateModifier}
      />
      
      <CombatSection 
        character={character} 
        onInputChange={handleInputChange} 
      />

      <SkillsSection 
        character={character} 
        onInputChange={handleInputChange}
      />

      <div className="flex justify-end mt-6 space-x-4">
      <button 
          onClick={handleSaveCharacter}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Save Character
        </button>
        <button 
          onClick={handleCancelCharacter}
          className="display grid px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CharacterSheet;