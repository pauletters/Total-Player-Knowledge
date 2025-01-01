import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { backgrounds } from './Backgrounds';

interface Character {
  basicInfo: {
    background?: string;
  };
}

interface BackgroundTabProps {
  character: Character;
  characterBackground: string;
  onBackstoryChange?: (backstory: string) => void;
  onInputChange: (field: any, value: any) => void;
}

const BackgroundTab: React.FC<BackgroundTabProps> = ({ 
  character, 
  onBackstoryChange 
}) => {
  const [backstory, setBackstory] = useState('');
  
  // Find the selected background data
  const selectedBackground = backgrounds.find(
    bg => bg.name.toLowerCase() === character.basicInfo.background?.toLowerCase()
  ) || {
    name: '',
    description: '',
    equipment: [],
    feature: { name: '', description: '' }
  };

  const handleBackstoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBackstory = e.target.value;
    setBackstory(newBackstory);
    if (onBackstoryChange) {
      onBackstoryChange(newBackstory);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <Card className="mb-4">
        <Card.Header className="bg-gray-100">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold">
              {selectedBackground.name || 'None Selected'}
            </h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {selectedBackground.name ? (
              <>
                <div>
                  <h4 className="text-lg font-medium mb-2">Description</h4>
                  <p className="text-gray-700">{selectedBackground.description}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Starter Background Equipment</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedBackground.equipment.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {selectedBackground.feature && (
                  <div>
                    <h4 className="text-lg font-medium mb-2">Special Feature: {selectedBackground.feature.name}</h4>
                    <p className="text-gray-700">{selectedBackground.feature.description}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center">Select a background in the character creation tab to see details</p>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card className="flex-grow">
        <Card.Header className="bg-gray-100">
          <h3 className="text-xl font-semibold">Character Backstory</h3>
        </Card.Header>
        <Card.Body className="h-full">
          <textarea
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              padding: '12px',
              border: '1px solid #cbd5e0',
              borderRadius: '4px',
              resize: 'vertical'
            }}
            placeholder="Write your character's backstory here..."
            value={backstory}
            onChange={handleBackstoryChange}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default BackgroundTab;