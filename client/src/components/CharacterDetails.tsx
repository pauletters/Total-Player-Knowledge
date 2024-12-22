// CharacterDetails.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Nav } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CHARACTER } from '../utils/queries';
import { UPDATE_CHARACTER_SPELL, TOGGLE_SPELL_PREPARED } from '../utils/mutations';
import { CharacterData } from './types';
import SpellCard from './Spells/SpellCard';
import SpellModal from './Spells/SpellSelection';
import { spellCache } from '../utils/spellCache';

interface CharacterParams {
  characterId: string;
}

const CharacterDetails: React.FC = () => {
  const { characterId } = useParams<keyof CharacterParams>() as CharacterParams;
  const navigate = useNavigate();
  const { loading: isLoading, error, data } = useQuery<{ character: CharacterData }>(GET_CHARACTER, {
    variables: { id: characterId },
  });
  const [updateCharacter] = useMutation(UPDATE_CHARACTER);
  type TabKey = 'details' | 'spells' | 'equipment' | 'background';
  const [activeTab, setActiveTab] = useState<TabKey>('details');
  const [showSpellModal, setShowSpellModal] = useState(false);
  const [updateCharacterSpells] = useMutation(UPDATE_CHARACTER_SPELLS);
  const [toggleSpellPrepared] = useMutation(TOGGLE_SPELL_PREPARED);

  const handleAddSpells = async (newSpells: ApiSpell[]) => {
    if (!data?.character) return;
    
    try {
      await updateCharacterSpells({
        variables: {
          id: characterId,
          spells: newSpells.map(spell => ({
            name: spell.name,
            level: spell.level,
            prepared: false
          }))
        },
        refetchQueries: [{ query: GET_CHARACTER, variables: { id: characterId } }]
      });
    } catch (error) {
      console.error('Error updating spells:', error);
    }
  };

  const handleRemoveSpell = async (spellName: string) => {
    if (!data?.character) return;
    
    const updatedSpells = data.character.spells.filter(spell => spell !== spellName);
    
    try {
      await updateCharacterSpells({
        variables: {
          id: characterId,
          spells: updatedSpells
        },
        refetchQueries: [{ query: GET_CHARACTER, variables: { id: characterId } }]
      });
    } catch (error) {
      console.error('Error removing spell:', error);
    }
  };

  const handleToggleSpellPrepared = async (spellName: string) => {
    if (!data?.character) return;
    
    try {
      await toggleSpellPrepared({
        variables: {
          id: characterId,
          spellName
        },
        refetchQueries: [{ query: GET_CHARACTER, variables: { id: characterId } }]
      });
    } catch (error) {
      console.error('Error toggling spell prepared status:', error);
    }
  };

  const { loading: isLoading, error, data } = useQuery<{ character: CharacterData }>(GET_CHARACTER, {
    variables: { id: characterId },
  });

  const getModifier = (score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  if (isLoading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <h2>Loading character...</h2>
        </div>
      </Container>
    );
  }

  if (error || !data?.character) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <h2>Character not found</h2>
          <Button variant="primary" onClick={() => navigate('/my-characters')}>
            Back to Characters
          </Button>
        </div>
      </Container>
    );
  }

  const character = data.character;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{character.basicInfo.name}</h1>
        <Button variant="outline-secondary" onClick={() => navigate('/my-characters')}>
          Back to Characters
        </Button>
      </div>

      <div className="character-sheet-container">
        <div className="content-container">
          {activeTab === 'details' && (
            <Row className="g-4">
              <Col md={4}>
                <Card>
                  <Card.Header>Basic Information</Card.Header>
                  <Card.Body>
                    <p><strong>Class:</strong> {character.basicInfo.class}</p>
                    <p><strong>Level:</strong> {character.basicInfo.level}</p>
                    <p><strong>Race:</strong> {character.basicInfo.race}</p>
                    <p><strong>Background:</strong> {character.basicInfo.background}</p>
                    <p><strong>Alignment:</strong> {character.basicInfo.alignment}</p>
                    {/* <p><strong>Experience:</strong> {character.experience}</p> */}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card>
                  <Card.Header>Combat Stats</Card.Header>
                  <Card.Body>
                    <p><strong>Armor Class:</strong> {character.combat.armorClass}</p>
                    <p><strong>Initiative:</strong> +{character.combat.initiative}</p>
                    <p><strong>Speed:</strong> {character.combat.speed} ft.</p>
                    <p><strong>Hit Points:</strong> {character.combat.hitPoints}/{character.combat.hitPoints}</p>
                    {/* <p><strong>Temporary HP:</strong> {character.hitPoints.temporary}</p>
                    <p><strong>Proficiency Bonus:</strong> +{character.proficiencyBonus}</p> */}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card>
                  <Card.Header>Attributes</Card.Header>
                  <Card.Body>
                    {Object.entries(character.attributes).map(([attr, value]) => (
                      <p key={attr}>
                        <strong>{attr.charAt(0).toUpperCase() + attr.slice(1)}:</strong>{' '}
                        {value} ({getModifier(value)})
                      </p>
                    ))}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card>
                  <Card.Header>Skills</Card.Header>
                  <Card.Body>
                    <Row>
                      {character.skills.proficiencies.map((skill, index) => (
                        <Col key={index} xs={6}>
                          <p>
                            <strong>{skill}:</strong>
                          </p>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card>
                  <Card.Header>Features & Traits</Card.Header>
                  <Card.Body>
                    {/* <ul className="list-unstyled">
                      {character.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul> */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === 'spells' && (
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Spells</span>
                  <Button variant="primary" size="sm" onClick={() => setShowSpellModal(true)}>
                    Add Spell
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {data.character.spells && data.character.spells.length > 0 ? (
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {data.character.spells.map((spell) => (
                      <Col key={spell.name}>
                        <SpellCard
                          name={spell.name}
                          level={spell.level}
                          prepared={spell.prepared}
                          onRemove={() => handleRemoveSpell(spell.name)}
                          onTogglePrepared={() => handleToggleSpellPrepared(spell.name)}
                        />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-center">No spells added yet.</p>
                )}
              </Card.Body>
            </Card>
          )}

          {activeTab === 'equipment' && (
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Equipment</span>
                  <Button variant="primary" size="sm">Add Equipment</Button>
                </div>
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled">
                  {character.equipment.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}
        

        {activeTab === 'background' && (
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Background</span>
                  <Button variant="primary" size="sm">Add Background</Button>
                </div>
              </Card.Header>
              <Card.Body>
                  <p className="text-center">No background added yet.</p>
              </Card.Body>
            </Card>
          )}
          </div>

        <div className="character-tabs">
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'details'}
                onClick={() => setActiveTab('details')}
              >
                Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'spells'}
                onClick={() => setActiveTab('spells')}
              >
                Spells
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'equipment'}
                onClick={() => setActiveTab('equipment')}
              >
                Equipment
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'background'}
                onClick={() => setActiveTab('background')}
              >
                Background
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </div>

      {character && (
    <SpellModal
      show={showSpellModal}
      onClose={() => setShowSpellModal(false)}
      onAddSpells={handleAddSpells}
      characterClass={character?.class}
    />
  )}
    </Container>
  );
};

export default CharacterDetails;