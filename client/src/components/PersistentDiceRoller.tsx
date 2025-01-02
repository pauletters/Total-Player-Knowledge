import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AuthService from '../utils/auth';
import '../styles/diceBox.css';


interface PersistentDiceRollerProps {
  DiceRoller: React.ComponentType;
}

const PersistentDiceRoller: React.FC<PersistentDiceRollerProps> = ({ DiceRoller }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show the dice roller if user is logged in
    const checkAuth = () => {
      setIsVisible(AuthService.loggedIn());
    };

    // Initial check
    checkAuth();

    // Set up event listener for auth changes
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="position-fixed" // Keep position-fixed
      style={{ 
        top: '155px', 
        right: '0', // Ensure it stays on the right side
        zIndex: 1050,
        transition: 'transform 0.3s ease-in-out',
        transform: `translateX(${isCollapsed ? 'calc(100% - 50px)' : '0'})` 
      }} 
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
          data-testid="dice-roller-toggle"
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
            width: '500px',  // Width of the dice roller container
            overflowY: 'auto', // Enables vertical scrolling
            overflowX: 'hidden', // Prevents horizontal scrolling
            borderRadius: '15px',
            borderStyle: 'solid',
            borderColor: 'red',
          }}
        >
          <Card 
            className="border-start-0 rounded-0"
            style={{ maxWidth: '500px'}}  // Increased to match
          >
            <DiceRoller />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersistentDiceRoller;