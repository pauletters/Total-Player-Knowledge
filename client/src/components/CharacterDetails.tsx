// CharacterDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Nav} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CHARACTER } from '../utils/queries';
import { 
  UPDATE_CHARACTER_SPELLS, 
  TOGGLE_SPELL_PREPARED, 
  UPDATE_CHARACTER_EQUIPMENT 
} from '../utils/mutations';
import { dndApi } from '../utils/dndApi';
import { CharacterData, ApiSpell } from './types';
import SpellCard from './Spells/SpellCard';
import SpellModal from './Spells/SpellSelection';
import EquipmentModal from './Equipment/EquipmentSelection';
import BackgroundTab from './BackgroundTab';

interface CharacterParams {
  characterId: string;
}

interface APIEquipmentProperty {
  name: string;
}

interface APIEquipment {
  index: string;
  name: string;
  equipment_category: {
    name: string;
  };
  cost?: {
    quantity: number;
    unit: string;
  };
  weight?: number;
  desc?: string[];
  properties?: APIEquipmentProperty[];
}

const CharacterDetails: React.FC = () => {
  const { characterId } = useParams<keyof CharacterParams>() as CharacterParams;
  const navigate = useNavigate();
  type TabKey = 'details' | 'spells' | 'equipment' | 'background' | 'diceRoller';
  const [activeTab, setActiveTab] = useState<TabKey>('details');
  const { loading: isLoading, error, data } = useQuery<{ character: CharacterData }>(GET_CHARACTER, {
    variables: { id: characterId },
  });

  const [spellDetails, setSpellDetails] = useState<Record<string, ApiSpell>>({}); // Cache spell details
  const [showSpellModal, setShowSpellModal] = useState(false);
  const [updateCharacterSpells] = useMutation(UPDATE_CHARACTER_SPELLS);
  const [toggleSpellPrepared] = useMutation(TOGGLE_SPELL_PREPARED);

  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [updateCharacterEquipment] = useMutation(UPDATE_CHARACTER_EQUIPMENT);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadSpellDetails = async () => {
      if (data?.character?.spells) {
        const spellsToLoad = data.character.spells.filter(
          spell => !spellDetails[spell.name]
        );
  
        // Load all spells in parallel
        const spellPromises = spellsToLoad.map(async (spell) => {
          try {
            const spellIndex = spell.name.toLowerCase().replace(/\s+/g, '-');
            const fetchedSpell = await dndApi.getSpell(spellIndex);
            return { name: spell.name, details: fetchedSpell };
          } catch (error) {
            console.error(`Error loading spell ${spell.name}:`, error);
            return null;
          }
        });
  
        const loadedSpells = await Promise.all(spellPromises);
        
        // Add all successfully loaded spells to the state
        const newSpellDetails = { ...spellDetails };
        loadedSpells.forEach(spell => {
          if (spell && spell.details) {
            newSpellDetails[spell.name] = spell.details;
          }
        });
        
        setSpellDetails(newSpellDetails);
      }
    };

    loadSpellDetails();
  }, [data?.character?.spells]);

  const handleAddSpells = async (newSpellList: { name: string; level: number; prepared: boolean; }[]) => {
    if (!data?.character) return;
    
    try {
      // Clean the spell data to ensure no __typename
      const cleanSpells = newSpellList.map(spell => ({
        name: spell.name,
        level: spell.level,
        prepared: spell.prepared
      }));
  
      await updateCharacterSpells({
        variables: {
          id: characterId,
          spells: cleanSpells
        },
        refetchQueries: [{ query: GET_CHARACTER, variables: { id: characterId } }]
      });
    } catch (error) {
      console.error('Error updating spells:', error);
    }
  };

  const handleRemoveSpell = async (spellName: string) => {
    if (!data?.character?.spells) return;
    
    

    try {
      const updatedSpells = data.character.spells.filter(spell => spell.name !== spellName)
      .map(spell => ({
        name: spell.name,
        level: spell.level,
        prepared: spell.prepared
      })
      );
    
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
    
    console.log('Attempting to toggle spell:', spellName);
    try {
      const { data: mutationData } = await toggleSpellPrepared({
        variables: {
          id: characterId,
          spellName
        },
        refetchQueries: [{ query: GET_CHARACTER, variables: { id: characterId } }]
      });
      console.log('Toggle spell result:', JSON.stringify(mutationData, null, 2));
      if (mutationData?.toggleSpellPrepared?.spells) {
        console.log('Updated spells:', mutationData.toggleSpellPrepared.spells);
      } else {
        console.log('No spells data in mutation response');
      }
    } catch (error) {
      console.error('Error toggling spell prepared status:', error);
    }
  };

  // Handler for adding equipment
  const handleAddEquipment = async (newEquipment: APIEquipment[]) => {
    if (!data?.character) return;

    try {
      // First, clean up the new equipment data
      const cleanNewEquipment = newEquipment.map(item => ({
        name: item.name,
        category: item.equipment_category.name,
        cost: item.cost ? {
          quantity: item.cost.quantity,
          unit: item.cost.unit
        } : undefined,
        weight: item.weight || null,
        description: item.desc || [],
        properties: item.properties?.map(p => p.name) || []
      }));
  
      // Then, clean up the existing equipment data
      const cleanExistingEquipment = data.character.equipment.map(item => ({
        name: item.name,
        category: item.category,
        cost: item.cost ? {
          quantity: item.cost.quantity,
          unit: item.cost.unit
        } : undefined,
        weight: item.weight || null,
        description: item.description || [],
        properties: item.properties || []
      }));
  
      // Combine the cleaned equipment arrays
      const combinedEquipment = [...cleanExistingEquipment, ...cleanNewEquipment];

      await updateCharacterEquipment({
        variables: {
          id: characterId,
          equipment: combinedEquipment
        },
        refetchQueries: [{ query: GET_CHARACTER, variables: { id: characterId } }]
      });
    } catch (error) {
      console.error('Error updating equipment:', error);
    }
  };

  // Handler for removing equipment
  const handleRemoveEquipment = async (equipmentName: string) => {
    if (!data?.character) return;

    try {
      const updatedEquipment = data.character.equipment
        .filter(item => item.name !== equipmentName)
        .map(item => ({
          name: item.name,
          category: item.category,
          cost: item.cost ? {
            quantity: item.cost.quantity,
            unit: item.cost.unit
          } : undefined,
          weight: item.weight || null,
          description: item.description || [],
          properties: item.properties || []
        }));

      await updateCharacterEquipment({
        variables: {
          id: characterId,
          equipment: updatedEquipment
        },
        refetchQueries: [{ query: GET_CHARACTER, variables: { id: characterId } }]
      });
    } catch (error) {
      console.error('Error removing equipment:', error);
    }
  };

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
                    {Object.entries(character.attributes).filter(([attr]) => attr !== '__typename').map(([attr, value]) => (
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
              {data?.character?.spells && data.character.spells.length > 0 ? (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {data.character.spells.map((spell) => (
                    <Col key={spell.name}>
                      <SpellCard
                        name={spell.name}
                        level={spell.level}
                        prepared={spell.prepared}
                        description={spellDetails[spell.name]?.desc?.[0] || ''}
                        school={spellDetails[spell.name]?.school?.name || ''}
                        fullSpellDetails={spellDetails[spell.name] ? {
                          range: spellDetails[spell.name].range,
                          castingTime: spellDetails[spell.name].casting_time,
                          duration: spellDetails[spell.name].duration,
                          components: spellDetails[spell.name].components,
                          classes: spellDetails[spell.name].classes?.map((c: { name: string }) => c.name)
                        } : undefined}
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
                  <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowEquipmentModal(true)}
                  >
                    Add Equipment
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="equipment-list">
              {character.equipment && character.equipment.length > 0 ? (
                  <div className="list-group list-group-flush">
                  {character.equipment.map((item) => (
                    <div 
                      key={item.name} 
                      className="list-group-item"
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        backgroundColor: expandedItems.has(item.name) ? '#f8f9fa' : 'inherit'
                      }}
                      onClick={() => {
                        setExpandedItems(prev => {
                          const newExpanded = new Set(prev);
                          if (newExpanded.has(item.name)) {
                            newExpanded.delete(item.name);
                          } else {
                            newExpanded.add(item.name);
                          }
                          return newExpanded;
                        });
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.backgroundColor = expandedItems.has(item.name) ? '#f8f9fa' : 'inherit';
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto" style={{ flex: 1 }}>
                          <div className="d-flex justify-content-between">
                            <div>
                              <div className="fw-bold">{item.name}</div>
                              <div className="text-muted small">{item.category}</div>
                            </div>
                            <div className="text-end">
                              {item.cost && (
                                <div className="small">{item.cost.quantity} {item.cost.unit}</div>
                              )}
                              {item.weight && (
                                <div className="text-muted small">{item.weight} lb</div>
                              )}
                            </div>
                          </div>
                          {expandedItems.has(item.name) && (
                            <>
                              {item.description && item.description.length > 0 && (
                                <div className="small text-muted mt-1">
                                  {item.description[0]}
                                </div>
                              )}
                              {item.properties && item.properties.length > 0 && (
                                <div className="small mt-1">
                                  <strong>Properties:</strong> {item.properties.join(', ')}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <Button 
                          variant="outline-danger"
                          size="sm"
                          className="ms-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveEquipment(item.name);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center my-4">No equipment added yet.</p>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
        
        {activeTab === 'background' && (
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Background</span>
                </div>
              </Card.Header>
              <Card.Body>
                <BackgroundTab 
                    character={character}
                    characterBackground={character.basicInfo.background}
                    onBackstoryChange={(newBackstory) => {
                    // Handle backstory update here with your mutation
                    console.log('Backstory updated:', newBackstory);
                }}
                    onInputChange={(field, value) => {
                    // Handle input change here
                    console.log(`Field ${field} changed to ${value}`);
                }}
              />
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
      characterClass={character.basicInfo.class}
      existingSpells={data.character.spells || []}
    />
  )}

{character && (
  <>
    <EquipmentModal
      show={showEquipmentModal}
      onClose={() => setShowEquipmentModal(false)}
      onAddEquipment={(equipment: APIEquipment[]) => handleAddEquipment(equipment)}
    />
  </>
)}
    </Container>
  );
};

export default CharacterDetails;