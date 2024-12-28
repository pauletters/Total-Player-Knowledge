import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';

// Define types for characters and campaigns
interface Character {
  _id: string;
  player: {
    username: string;
  };
  basicInfo: {
    name: string;
    race: string;
    class: string;
    level: number;
  };
  private: boolean;
}

interface Campaign {
  _id: string;
  name: string;
  description: string;
  players: Character[];
  milestones: string[];
}

interface CampaignDashboardProps {
  campaign: Campaign;
  onAddMilestone: (milestone: string) => void;
  onRemoveMilestone: (index: number) => void;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaign,
  onAddMilestone,
  onRemoveMilestone,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState('');

  // Debugging: Log the campaign data
  console.log('Campaign Data:', campaign);

  // Handle card click behavior
  const handleCardClick = (character: Character) => {
    if (!character.private) {
      setSelectedCharacter(character);
      setShowModal(true);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCharacter(null);
  };

  // Add milestone
  const handleAddMilestone = () => {
    if (newMilestone.trim() !== '') {
      onAddMilestone(newMilestone);
      setNewMilestone('');
    }
  };

  return (
    <>
      <Container>
        <h1 className="mb-4">{campaign.name} Dashboard</h1>
        {campaign.description && <p>{campaign.description}</p>}

        <Row xs={1} md={2} lg={3} className="g-4">
          {campaign.players.map((character) => (
            <Col key={character._id}>
              <Card
                className="h-100"
                style={{
                  cursor: character.private ? 'not-allowed' : 'pointer',
                  opacity: character.private ? 0.6 : 1, // Visual indication for private characters
                }}
                onClick={() => handleCardClick(character)}
              >
                <Card.Body>
                  <Card.Title>{character.basicInfo.name}</Card.Title>
                  <Card.Text className="text-muted">
                    Player: {character.player.username}
                    <br />
                    Race: {character.basicInfo.race}
                    <br />
                    Class: {character.basicInfo.class}
                    <br />
                    Level: {character.basicInfo.level}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Milestone Log */}
        <div className="mt-5">
          <h2>Milestones</h2>
          <ul className="list-group mb-3">
            {campaign.milestones.map((milestone, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {milestone}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onRemoveMilestone(index)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <Form>
            <Form.Group controlId="addMilestone">
              <Form.Label>Add a New Milestone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a milestone"
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
              />
            </Form.Group>
            <Button className="mt-2" variant="primary" onClick={handleAddMilestone}>
              Add Milestone
            </Button>
          </Form>
        </div>
      </Container>

      {/* Character Modal */}
      {selectedCharacter && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedCharacter.basicInfo.name}'s Character Sheet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Player: {selectedCharacter.player.username}</h5>
            <p>
              <strong>Race:</strong> {selectedCharacter.basicInfo.race}
              <br />
              <strong>Class:</strong> {selectedCharacter.basicInfo.class}
              <br />
              <strong>Level:</strong> {selectedCharacter.basicInfo.level}
            </p>
            {/* Additional character details */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default CampaignDashboard;
