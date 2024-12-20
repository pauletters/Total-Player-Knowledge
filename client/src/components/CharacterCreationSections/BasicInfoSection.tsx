import React from 'react';
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

export const BasicInfoSection: React.FC<SectionProps> = ({ character, onInputChange }) => {
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
          {/* Background dropdown positioned below Race */}
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
    </section>
  );
};