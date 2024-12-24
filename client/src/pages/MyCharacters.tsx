import { useState } from 'react';
import { Container, Button, Card, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../utils/queries';
import UserMenu from '../components/UserMenu';
import DiceRoller from '../components/DiceRoller';

interface Character {
  _id: string;
  basicInfo: {
    name: string;
    class: string;
    level: number;
  };
}

const MyCharacters = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const { data } = useQuery<{ characters: Character[] }>(GET_CHARACTERS);
  
  const handleCreateCharacter = () => {
    navigate('/my-characters/character-creation');
  };

  const handleViewCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setShowDiceRoller(true);
  };

  const isCreatingCharacter = location.pathname.includes('/character-creation');
  const isViewingCharacter = location.pathname.split('/').length > 2 && !isCreatingCharacter;

  const characters = data?.characters || [];

  return (
    <>
      <UserMenu />
      <Container>
        {!isCreatingCharacter && !isViewingCharacter && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>My Characters</h1>
              <Button variant="primary" onClick={handleCreateCharacter}>
                Create New Character
              </Button>
            </div>

            {characters.length === 0 ? (
              <div className="text-center">
                <p>You haven't created any characters yet.</p>
                <Button variant="outline-primary" onClick={handleCreateCharacter}>
                  Create Your First Character
                </Button>
              </div>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {characters.map((character) => (
                  <Col key={character._id}>
                    <Card>
                      <Card.Body>
                        <Card.Title>{character.basicInfo.name}</Card.Title>
                        <Card.Text>
                          Level {character.basicInfo.level} {character.basicInfo.class}
                        </Card.Text>
                        <div className="d-flex justify-content-between gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => navigate(`/my-characters/${character._id}`)}
                          >
                            View Character
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleViewCharacter(character)}
                          >
                            Roll Dice
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}

        <Modal 
          show={showDiceRoller} 
          onHide={() => setShowDiceRoller(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedCharacter ? `Dice Roller - ${selectedCharacter.basicInfo.name}` : 'Dice Roller'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DiceRoller />
          </Modal.Body>
        </Modal>

        <Outlet />
      </Container>
    </>
  );
};

export default MyCharacters;