import React, { useState, useMemo } from 'react';
import { SectionProps } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/avatar.css';

const raceOptions = [
  'Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Half-Elf', 'Halfling', 
  'Half-Orc', 'Human', 'Tiefling'
];

const classOptions = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter',
  'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer',
  'Warlock', 'Wizard'
];

const backgroundOptions = [
  'Acolyte', 'Charlatan', 'Criminal', 'Entertainer',
  'Folk Hero', 'Guild Artisan', 'Hermit', 'Noble',
  'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin'
];

const alignmentOptions = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
];

const classSkillProficiencies = {
  fighter: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
  wizard: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
  rogue: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
  cleric: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
  bard: ['Any'],
  ranger: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
  paladin: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
  sorcerer: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
  monk: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
  druid: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
  warlock: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
  barbarian: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival']
};

type ClassType = 'fighter' | 'wizard' | 'rogue' | 'cleric' | 'bard' | 'ranger' | 'paladin' | 'sorcerer' | 'monk' | 'druid' | 'warlock' | 'barbarian';
type BackgroundType = 'acolyte' | 'charlatan' | 'criminal' | 'entertainer' | 'folk hero' | 'guild artisan' | 'hermit' | 'noble' | 'outlander' | 'sage' | 'sailor' | 'soldier' | 'urchin';

const backgroundSkillProficiencies: Record<BackgroundType, string[]> = {
  acolyte: ['Insight', 'Religion'],
  charlatan: ['Deception', 'Sleight of Hand'],
  criminal: ['Deception', 'Stealth'],
  entertainer: ['Acrobatics', 'Performance'],
  'folk hero': ['Animal Handling', 'Survival'],
  'guild artisan': ['Insight', 'Persuasion'],
  hermit: ['Medicine', 'Religion'],
  noble: ['History', 'Persuasion'],
  outlander: ['Athletics', 'Survival'],
  sage: ['Arcana', 'History'],
  sailor: ['Athletics', 'Perception'],
  soldier: ['Athletics', 'Intimidation'],
  urchin: ['Sleight of Hand', 'Stealth']
};


interface AvatarSelectorProps {
  selectedAvatar: string;
  onAvatarChange: (avatar: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onAvatarChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const avatars = [
    '../assets/avatar1.png',
    '../assets/avatar2.png',
    '../assets/avatar3.png',
    '../assets/avatar4.png',
    '../assets/avatar5.png',
    '../assets/avatar6.png',
    '../assets/avatar7.png',
    '../assets/avatar8.png',
    '../assets/avatar9.png',
    '../assets/avatar10.png',
    '../assets/avatar11.png',
    '../assets/avatar12.png',
    '../assets/avatar13.png',
    '../assets/avatar14.png',
    '../assets/avatar15.png',
    '../assets/avatar16.png',
    '../assets/avatar17.png',
    '../assets/avatar18.png'
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? avatars.length - 1 : prev - 1));
    onAvatarChange(avatars[currentIndex === 0 ? avatars.length - 1 : currentIndex - 1]);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === avatars.length - 1 ? 0 : prev + 1));
    onAvatarChange(avatars[currentIndex === avatars.length - 1 ? 0 : currentIndex + 1]);
  };

  return (
    <div className="avatar-selector-container">
      <button onClick={handlePrevious} className="avatar-nav-button left">
        <ChevronLeft className="avatar-nav-icon" />
      </button>
      
      <div className="avatar-image-container">
        <img
          src={avatars[currentIndex]}
          alt="Character Avatar"
          className="avatar-image"
        />
      </div>
      
      <button onClick={handleNext} className="avatar-nav-button right">
        <ChevronRight className="avatar-nav-icon" />
      </button>
    </div>
  );
};

export const BasicInfoSection: React.FC<SectionProps> = ({ character, onInputChange }) => {
  const availableSkills = useMemo(() => {
    const classSkills = character.basicInfo.class ? 
      classSkillProficiencies[character.basicInfo.class.toLowerCase() as ClassType] || [] : [];
    const backgroundSkills = character.basicInfo.background ? 
      backgroundSkillProficiencies[character.basicInfo.background.toLowerCase() as BackgroundType] || [] : [];
    
    return {
      classSkills,
      backgroundSkills,
      allSkills: [...new Set([...classSkills, ...backgroundSkills])]
    };
  }, [character.basicInfo.class, character.basicInfo.background]);

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Character Name
          </label>
          <input 
            type="text"
            value={character.basicInfo.name}
            onChange={(e) => onInputChange('basicInfo', 'name', e.target.value)}
            placeholder="Enter character name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="col-span-2 flex items-center justify-between">
          <div className="flex gap-4 w-full">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Race
              </label>
              <select 
                value={character.basicInfo.race}
                onChange={(e) => onInputChange('basicInfo', 'race', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select Race</option>
                {raceOptions.map(race => (
                  <option key={race.toLowerCase()} value={race.toLowerCase()}>
                    {race}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
              <br/>
                Background
              </label>
              <select 
                value={character.basicInfo.background}
                onChange={(e) => onInputChange('basicInfo', 'background', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select Background</option>
                {backgroundOptions.map(background => (
                  <option key={background.toLowerCase()} value={background.toLowerCase()}>
                    {background}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <br/>
                Alignment
              </label>
              <select 
                value={character.basicInfo.alignment}
                onChange={(e) => onInputChange('basicInfo', 'alignment', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select Alignment</option>
                {alignmentOptions.map(alignment => (
                  <option key={alignment.toLowerCase()} value={alignment.toLowerCase()}>
                    {alignment}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class
          </label>
          <select 
            value={character.basicInfo.class}
            onChange={(e) => onInputChange('basicInfo', 'class', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Class</option>
            {classOptions.map(cls => (
              <option key={cls.toLowerCase()} value={cls.toLowerCase()}>
                {cls}
              </option>
            ))}
          </select>
          <div className="avatar-container">
          <label className="block text-sm font-medium text-gray-700 mb-2">
          <br/>
            Please Select an Avatar
          </label>
          <AvatarSelector
            selectedAvatar={character.basicInfo.avatar}
            onAvatarChange={(avatar: string) => onInputChange('basicInfo', 'avatar', avatar)}
          />
        </div>
        </div>
      </div>

      {/* Skill Proficiencies section remains unchanged */}
      {(character.basicInfo.class || character.basicInfo.background) && (
        <div className="mt-4">
          <h5 className="text-xs font-medium text-gray-700 mb-1">Available Skill Proficiencies</h5>
          <div className="grid grid-cols-2 gap-2">
            {character.basicInfo.class && (
              <div className="border rounded p-2 text-xs">
                <span className="font-medium">{character.basicInfo.class.charAt(0).toUpperCase() + character.basicInfo.class.slice(1).toLowerCase()}:</span>{' '}
                <span className="text-gray-600">
                  {availableSkills.classSkills.join(', ')}
                </span>
              </div>
            )}
            {character.basicInfo.background && (
              <div className="border rounded p-2 text-xs">
                <span className="font-medium">{character.basicInfo.background.charAt(0).toUpperCase() + character.basicInfo.background.slice(1).toLowerCase()}:</span>{' '}
                <span className="text-gray-600">
                  {availableSkills.backgroundSkills.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default BasicInfoSection;