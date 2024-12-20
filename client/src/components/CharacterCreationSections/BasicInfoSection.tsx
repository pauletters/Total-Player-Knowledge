import React, { useMemo } from 'react';
import { SectionProps } from '../types';

const raceOptions = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 
  'Half-Elf', 'Half-Orc', 'Tiefling', 'Dragonborn'
];

const classOptions = [
  'Fighter', 'Wizard', 'Rogue', 'Cleric', 'Bard', 
  'Ranger', 'Paladin', 'Sorcerer', 'Monk', 
  'Druid', 'Warlock', 'Barbarian'
];

const backgroundOptions = [
  'Acolyte', 'Charlatan', 'Criminal', 'Entertainer',
  'Folk Hero', 'Guild Artisan', 'Hermit', 'Noble',
  'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin'
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
        <div className="relative">
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
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background
            </label>
            <select 
              value={character.basicInfo.background}
              onChange={(e) => onInputChange('basicInfo', 'background', e.target.value)}
              className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select Background</option>
              {backgroundOptions.map(background => (
                <option key={background.toLowerCase()} value={background.toLowerCase()}>
                  {background}
                </option>
              ))}
            </select>
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
        </div>
      </div>
      
      {/* Compact Skill Proficiencies Display */}
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