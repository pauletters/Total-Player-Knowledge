import React from 'react';
import { Card, Button } from 'react-bootstrap';

interface SpellCardProps {
  name: string;
  level: number;
  prepared: boolean;
  onRemove: () => void;
  onTogglePrepared: () => void;
}

const SpellCard: React.FC<SpellCardProps> = ({ 
  name, 
  level, 
  prepared, 
  onRemove,
  onTogglePrepared 
}) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-1">{name}</h5>
            <p className="text-muted mb-2">Level {level === 0 ? 'Cantrip' : level}</p>
          </div>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            ×
          </Button>
        </div>
        <Button
          variant={prepared ? "success" : "outline-secondary"}
          size="sm"
          onClick={onTogglePrepared}
          className="mt-2"
        >
          {prepared ? 'Prepared' : 'Not Prepared'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default SpellCard;