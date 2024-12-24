import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PersistentDiceRollerProps {
  DiceRoller: React.ComponentType;
}

const PersistentDiceRoller: React.FC<PersistentDiceRollerProps> = ({ DiceRoller }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className="position-fixed end-0"
      style={{ top: '155px', zIndex: 1050 }} 
    >
      <div className="d-flex">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="btn btn-light border d-flex flex-column align-items-center justify-content-center gap-2"
          style={{ 
            height: '80px',
            width: '50px',
            borderRadius: '8px 0 0 8px',
            padding: '4px',
            backgroundColor: isCollapsed ? 'red' : 'lightgray',
            color: isCollapsed ? 'white' : 'black'
          }}
          aria-label={isCollapsed ? "Expand dice roller" : "Collapse dice roller"}
        >
          {isCollapsed ? <ChevronLeft size={50} /> : <ChevronRight size={50} />}
          <div 
            style={{ 
              writingMode: 'vertical-rl', 
              textOrientation: 'mixed', 
              transform: 'rotate(270deg)',
              fontSize: '0.875rem'
            }}
          >
            Dice Roller
          </div>
        </button>

        <div 
          style={{
            width: isCollapsed ? 0 : '400px',
            overflow: 'hidden',
            transition: 'width 0.3s ease-in-out'
          }}
        >
          <Card 
            className="border-start-0 rounded-0"
            style={{ maxWidth: '400px' }}
          >
            <DiceRoller />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersistentDiceRoller;