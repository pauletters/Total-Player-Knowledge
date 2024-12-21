import { useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../utils/queries';
import UserMenu from '../components/UserMenu';

// You might want to create a type for your characters
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

  const { loading, error, data } = useQuery<{ characters: Character[] }>(GET_CHARACTERS);
  
  const handleCreateCharacter = () => {
    // Navigate to the character creation page
    navigate('/my-characters/character-creation');
  };

  const handleViewCharacter = (characterId: string) => {
    navigate(`/my-characters/${characterId}`);
  };

   // Check if we're on the character creation route or viewing a character
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
              <Button 
                variant="primary" 
                onClick={handleCreateCharacter}
              >
                Create New Character
              </Button>
            </div>

            {characters.length === 0 ? (
              <div className="text-center">
                <p>You haven't created any characters yet.</p>
                <Button 
                  variant="outline-primary" 
                  onClick={handleCreateCharacter}
                >
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
                        <div className="d-flex justify-content-between">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewCharacter(character._id)}
                          >
                            View
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

        {/* Add Outlet to render nested routes */}
        <Outlet />
      </Container>
    </>
  );
};

export default MyCharacters;