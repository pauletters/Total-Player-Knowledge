// CharacterDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Nav, Tab } from 'react-bootstrap';

interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;
  alignment: string;
  experience: number;
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: {
    name: string;
    proficient: boolean;
    modifier: number;
  }[];
  proficiencyBonus: number;
  hitPoints: {
    maximum: number;
    current: number;
    temporary: number;
  };
  armorClass: number;
  initiative: number;
  speed: number;
  equipment: string[];
  features: string[];
  spells?: {
    level: number;
    name: string;
    prepared: boolean;
  }[];
}

interface CharacterParams {
  characterId: string;
}

const CharacterDetails: React.FC = () => {
  const { characterId } = useParams<keyof CharacterParams>() as CharacterParams;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<Character | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  const getCharacterData = (id: string): Character | null => {
    // This is mock data - replace with your actual data fetching logic
    const characters: { [key: string]: Character } = {
      '1': {
        id: '1',
        name: 'Aragorn',
        class: 'Ranger',
        level: 5,
        race: 'Human',
        background: 'Noble',
        alignment: 'Lawful Good',
        experience: 14000,
        attributes: {
          strength: 16,
          dexterity: 14,
          constitution: 15,
          intelligence: 12,
          wisdom: 14,
          charisma: 14
        },
        skills: [
          { name: 'Athletics', proficient: true, modifier: 5 },
          { name: 'Survival', proficient: true, modifier: 4 },
          { name: 'Stealth', proficient: true, modifier: 4 }
        ],
        proficiencyBonus: 3,
        hitPoints: {
          maximum: 45,
          current: 45,
          temporary: 0
        },
        armorClass: 15,
        initiative: 2,
        speed: 30,
        equipment: ['Longsword', 'Studded Leather Armor', 'Longbow', 'Arrows (20)'],
        features: ['Favored Enemy', 'Natural Explorer', 'Extra Attack']
      },
      '2': {
        id: '2',
        name: 'Gandalf',
        class: 'Wizard',
        level: 20,
        race: 'Human',
        background: 'Sage',
        alignment: 'Neutral Good',
        experience: 355000,
        attributes: {
          strength: 10,
          dexterity: 12,
          constitution: 14,
          intelligence: 20,
          wisdom: 18,
          charisma: 16
        },
        skills: [
          { name: 'Arcana', proficient: true, modifier: 11 },
          { name: 'History', proficient: true, modifier: 11 },
          { name: 'Investigation', proficient: true, modifier: 11 }
        ],
        proficiencyBonus: 6,
        hitPoints: {
          maximum: 122,
          current: 122,
          temporary: 0
        },
        armorClass: 12,
        initiative: 1,
        speed: 30,
        equipment: ['Staff', 'Spellbook', 'Component Pouch', 'Robes'],
        features: ['Spellcasting', 'Arcane Recovery', 'Spell Mastery']
      }
    };

    return characters[id] || null;
  };

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      try {
        // Simulate API call
        const data = getCharacterData(characterId);
        setCharacter(data);
      } catch (error) {
        console.error('Error fetching character:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <h2>Loading character...</h2>
        </div>
      </Container>
    );
  }

  if (!character) {
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

  const getModifier = (score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{character.name}</h1>
        <Button variant="outline-secondary" onClick={() => navigate('/my-characters')}>
          Back to Characters
        </Button>
      </div>

      <Row>
        <Col sm={9}>
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'details')}>
            <Tab.Content>
              <Tab.Pane eventKey="details">
                <Row className="g-4">
                  <Col md={4}>
          <Card>
            <Card.Header>Basic Information</Card.Header>
            <Card.Body>
              <p><strong>Class:</strong> {character.class}</p>
              <p><strong>Level:</strong> {character.level}</p>
              <p><strong>Race:</strong> {character.race}</p>
              <p><strong>Background:</strong> {character.background}</p>
              <p><strong>Alignment:</strong> {character.alignment}</p>
              <p><strong>Experience:</strong> {character.experience}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>Combat Stats</Card.Header>
            <Card.Body>
              <p><strong>Armor Class:</strong> {character.armorClass}</p>
              <p><strong>Initiative:</strong> +{character.initiative}</p>
              <p><strong>Speed:</strong> {character.speed} ft.</p>
              <p><strong>Hit Points:</strong> {character.hitPoints.current}/{character.hitPoints.maximum}</p>
              <p><strong>Temporary HP:</strong> {character.hitPoints.temporary}</p>
              <p><strong>Proficiency Bonus:</strong> +{character.proficiencyBonus}</p>
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
                {character.skills.map((skill) => (
                  <Col key={skill.name} xs={6}>
                    <p>
                      <strong>{skill.name}:</strong> +{skill.modifier}
                      {skill.proficient && ' (P)'}
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
              <ul className="list-unstyled">
                {character.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
        </Row>
        </Tab.Pane>

        <Tab.Pane eventKey="spells">
                <Card>
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Spells</span>
                      <Button variant="primary" size="sm">Add Spell</Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {character.spells && character.spells.length > 0 ? (
                      <Row xs={1} md={2} lg={3} className="g-4">
                        {character.spells.map((spell, index) => (
                          <Col key={index}>
                            <Card>
                              <Card.Body>
                                <p><strong>{spell.name}</strong></p>
                                <p>Level {spell.level}</p>
                                <p>{spell.prepared ? 'Prepared' : 'Not Prepared'}</p>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <p className="text-center">No spells added yet.</p>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="equipment">
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
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>

        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link 
                eventKey="details" 
                active={activeTab === 'details'}
                onClick={() => setActiveTab('details')}
              >
                Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="spells" 
                active={activeTab === 'spells'}
                onClick={() => setActiveTab('spells')}
              >
                Spells
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="equipment" 
                active={activeTab === 'equipment'}
                onClick={() => setActiveTab('equipment')}
              >
                Equipment
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
    </Container>
  );
};

export default CharacterDetails;