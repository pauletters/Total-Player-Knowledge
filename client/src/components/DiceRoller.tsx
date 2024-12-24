import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


interface DiceProps {
    sides: number;
    value: number;
    rolling?: boolean;
  }
  
  interface DieType {
    sides: number;
    name: string;
  }
  
  interface RollEntry {
    id: number;
    die: string;
    numberOfDice: number;
    rolls: number[];
    total: number;
    timestamp: string;
  }

// Custom Dice Component
const Dice: React.FC<DiceProps> = ({ sides, value, rolling = false }) => {
    const dicePaths: Record<number, string[]> = {
    4: [
      "M12 2L2 22L22 22Z",
      "M12 7L7 17H17Z"
    ],
    6: [
      "M3 9L12 3L21 9L21 15L12 21L3 15Z"
    ],
    8: [
      "M12 2L2 12L12 22L22 12Z",
      "M12 7L7 12L12 17L17 12Z"
    ],
    10: [
      "M12 2L22 8L18 22L6 22L2 8Z"
    ],
    12: [
      "M12 2L20 8.5L17 21.5L7 21.5L4 8.5Z"
    ],
    20: [
      "M12 2L22 9L18 22L6 22L2 9Z",
      "M12 7L17 9L15 17L9 17L7 9Z"
    ],
    100: [
      "M12 2L22 8L18 22L6 22L2 8Z",
      "M10 12L14 12L14 18L10 18Z"
    ]
  };

  return (
    <svg 
      viewBox="0 0 24 24" 
      style={{ 
        width: '4rem',
        height: '4rem',
        transition: 'transform 0.5s',
        animation: rolling ? 'spin 1s linear infinite' : 'none',
        fill: rolling ? 'gray' : 'rgb(31, 41, 55)', 
        stroke: 'white', 
        strokeWidth: 1 
      }}
    >
      {dicePaths[sides].map((path, index) => (
        <path key={index} d={path} />
      ))}
      {!rolling && (
        <text 
          x="12" 
          y="16" 
          textAnchor="middle" 
          fill="white" 
          fontSize="8"
        >
          {value}
        </text>
      )}
    </svg>
  );
};

const DiceRoller: React.FC = () => {
    const diceTypes: DieType[] = [
    { sides: 4, name: 'd4' },
    { sides: 6, name: 'd6' },
    { sides: 8, name: 'd8' },
    { sides: 10, name: 'd10' },
    { sides: 12, name: 'd12' },
    { sides: 20, name: 'd20' },
    { sides: 100, name: 'd100' }
  ];

  const [selectedDie, setSelectedDie] = useState<DieType>(diceTypes[5]);
  const [currentRoll, setCurrentRoll] = useState<RollEntry | null>(null);
  const [rollHistory, setRollHistory] = useState<RollEntry[]>(() => {
      // Initialize rollHistory from localStorage
      const savedHistory = localStorage.getItem('diceRollHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [numberOfDice, setNumberOfDice] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Save to localStorage whenever rollHistory changes
  useEffect(() => {
      localStorage.setItem('diceRollHistory', JSON.stringify(rollHistory));
  }, [rollHistory]);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const rolls = Array.from({ length: numberOfDice }, () => 
        Math.floor(Math.random() * selectedDie.sides) + 1
      );
      const totalRoll = rolls.reduce((a, b) => a + b, 0);
      const rollEntry = {
        id: Date.now(),
        die: selectedDie.name,
        numberOfDice,
        rolls,
        total: totalRoll,
        timestamp: new Date().toLocaleTimeString()
      };
      setCurrentRoll(rollEntry);
      setRollHistory(prev => [rollEntry, ...prev].slice(0, 10));
      setIsRolling(false);
    }, 1000);
  };

  const clearHistory = () => {
    setRollHistory([]);
    setCurrentRoll(null);
    localStorage.removeItem('diceRollHistory');
};

  return (
    <Card style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <Card.Header>
        <Card.Title>Dice Roller</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="d-flex gap-3 mb-4">
          <Form.Select 
            style={{ width: '120px' }}
            value={numberOfDice}
            onChange={(e) => setNumberOfDice(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>
                {num} Die{num > 1 ? 's' : ''}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            style={{ width: '120px' }}
            value={selectedDie.name}
            onChange={(e) => setSelectedDie(diceTypes.find(die => die.name === e.target.value)!)}
          >
            {diceTypes.map(die => (
              <option key={die.name} value={die.name}>{die.name}</option>
            ))}
          </Form.Select>

          <Button 
            variant="primary"
            onClick={rollDice} 
            disabled={isRolling}
          >
            {isRolling ? 'Rolling...' : `Roll ${numberOfDice} ${selectedDie.name}`}
          </Button>

          <Button
              variant="outline-secondary"
              onClick={clearHistory}
              disabled={rollHistory.length === 0 || isRolling}
              >
              Clear History
          </Button>
        </div>

        <div className="d-flex justify-content-center mb-4">
          {currentRoll && currentRoll.rolls.map((roll, index) => (
            <Dice 
              key={index} 
              sides={selectedDie.sides} 
              value={roll} 
              rolling={isRolling} 
            />
          ))}
        </div>

        {currentRoll && !isRolling && (
          <div className="mb-4 p-3 bg-light rounded">
            <h3 className="fw-bold">Total Roll: {currentRoll.total}</h3>
            <div className="text-secondary">
              Rolled {currentRoll.numberOfDice} {currentRoll.die}: {currentRoll.rolls.join(', ')}
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-3">Roll History</h3>
          {rollHistory.length === 0 ? (
            <p className="text-secondary">No rolls yet</p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {rollHistory.map((roll) => (
                <div 
                  key={roll.id} 
                  className="d-flex justify-content-between align-items-center bg-light p-2 rounded"
                >
                  <div>
                    <span className="fw-medium">{roll.numberOfDice} {roll.die}</span>
                    <span className="ms-2 text-secondary">
                      Rolls: {roll.rolls.join(', ')}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold">Total: {roll.total}</span>
                    <span className="text-secondary small">{roll.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default DiceRoller;