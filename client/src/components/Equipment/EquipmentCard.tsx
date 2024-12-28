import React from 'react';
import { Card, Button } from 'react-bootstrap';

interface EquipmentCardProps {
  name: string;
  category: string;
  cost?: {
    quantity: number;
    unit: string;
  };
  weight?: number;
  description?: string[];
  properties?: string[];
  onRemove: () => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({
  name,
  category,
  cost,
  weight,
  description,
  properties,
  onRemove
}) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="equipment-name-container">
            <h5 className="mb-1">{name}</h5>
            <p className="text-muted mb-2">
              {category}
              {cost && ` • ${cost.quantity} ${cost.unit}`}
              {weight && ` • ${weight} lb`}
            </p>
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
        
        {description && description.length > 0 && (
          <p className="small text-muted mb-2">{description[0]}</p>
        )}
        
        {properties && properties.length > 0 && (
          <p className="small mb-0">
            <strong>Properties:</strong> {properties.join(', ')}
          </p>
        )}
      </Card.Body>
    </Card>
  );
};

export default EquipmentCard;