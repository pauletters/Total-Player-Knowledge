import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Card, Row, Col } from 'react-bootstrap';
import { dndApi } from '../../utils/dndApi';
import { spellCache } from '../../utils/spellCache';

interface SpellApiResponse {
  count: number;
  results: {
    index: string;
    name: string;
    url: string;
  }[];
}

interface Spell {
  index: string;
  name: string;
  level: number;
  school: {
    name: string;
  };
  classes: {
    name: string;
  }[];
  desc: string[];
}

interface SpellModalProps {
  show: boolean;
  onClose: () => void;
  onAddSpells: (spells: Spell[]) => void;
  characterClass?: string;
}

const SpellModal: React.FC<SpellModalProps> = ({ 
  show, 
  onClose, 
  onAddSpells, 
  characterClass 
}) => {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpells, setSelectedSpells] = useState<Set<string>>(new Set());
  const [spellDetails, setSpellDetails] = useState<Record<string, Spell>>({});
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [expandedSpellId, setExpandedSpellId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllSpells = async () => {
      if (!show) return;
      
      try {
        setLoading(true);
        const response = await dndApi.getSpells() as SpellApiResponse;
        
        if (response?.results) {
          // Get all spell names
          const spellNames = response.results.map(spell => spell.name);
          
          // Fetch details for all spells with controlled concurrency
          const fetchSpellDetails = async (names: string[]) => {
            const batchSize = 10;
            const spellDetails: Spell[] = [];

            for (let i = 0; i < names.length; i += batchSize) {
              const batch = names.slice(i, i + batchSize);
              
              const batchPromises = batch.map(async (name) => {
                try {
                  // First try to get from cache
                  const cachedSpell = await spellCache.getSpell(name);
                  if (cachedSpell) return cachedSpell;
                  
                  // If not in cache, fetch from API
                  const spellIndex = name.toLowerCase().replace(/\s+/g, '-');
                  return await dndApi.getSpell(spellIndex) as Spell;
                } catch (error) {
                  console.warn(`Could not load spell ${name}:`, error);
                  return null;
                }
              });

              // Wait for batch to complete
              const batchResults = await Promise.all(batchPromises);
              spellDetails.push(...batchResults.filter((spell): spell is Spell => spell !== null));

              // Optional: add a small delay between batches to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 500));
            }

            return spellDetails;
          };

          const allSpellDetails = await fetchSpellDetails(spellNames);
          
          setSpells(allSpellDetails);
          setIsFullyLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching spells:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSpells();
  }, [show]);

  // Modify the existing methods to work with the new approach
  const handleSpellClick = async (spellIndex: string) => {
    const newSelected = new Set(selectedSpells);
    
    if (newSelected.has(spellIndex)) {
      newSelected.delete(spellIndex);
    } else {
      if (!spellDetails[spellIndex]) {
        try {
          const cachedSpell = await spellCache.getSpell(spellIndex);
          if (cachedSpell) {
            setSpellDetails(prev => ({
              ...prev,
              [spellIndex]: cachedSpell
            }));
          }
        } catch (error) {
          console.error('Error fetching spell details:', error);
          return;
        }
      }
      newSelected.add(spellIndex);
    }
    setSelectedSpells(newSelected);
  };

const handleAddSpells = () => {
  const selectedSpellsList = spells.filter(spell => 
    selectedSpells.has(spell.index)
  );
  onAddSpells(selectedSpellsList);
  onClose();
};

const filteredSpells = spells.filter(spell => {
  const matchesSearch = searchTerm === '' || spell.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesClass = !characterClass || 
    spell.classes.some(c => c.name.toLowerCase() === characterClass.toLowerCase()) || characterClass.toLowerCase() === 
    spell.classes[0]?.name.toLowerCase();
  const matchesLevel = selectedLevel === 'all' || spell.level === parseInt(selectedLevel);
  return matchesSearch && matchesClass && matchesLevel;
});

useEffect(() => {
  console.log('Filtered Spells Debug:');
  console.log('Total Spells:', spells.length);
  console.log('Character Class:', characterClass);
  console.log('Selected Level:', selectedLevel);
  console.log('Search Term:', searchTerm);
  
  const debugFiltered = spells.map(spell => ({
    name: spell.name,
    level: spell.level,
    classes: spell.classes.map(c => c.name),
    matchesSearch: searchTerm === '' || spell.name.toLowerCase().includes(searchTerm.toLowerCase()),
    matchesClass: !characterClass || 
      spell.classes.some(c => 
        c.name.toLowerCase() === characterClass.toLowerCase() ||
        characterClass.toLowerCase() === spell.classes[0]?.name.toLowerCase()
      ),
    matchesLevel: selectedLevel === 'all' || spell.level === parseInt(selectedLevel)
  }));
  
  console.log('Detailed Spell Filtering:', debugFiltered);
}, [spells, characterClass, selectedLevel, searchTerm]);

  return (
    <Modal show={show} onHide={onClose} size="lg" closeButton>
      <Modal.Header closeButton>
        <Modal.Title>Add Spells</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mb-4">
          <Row>
            <Col md={8}>
              <Form.Control
                type="text"
                placeholder="Search spells..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
              />
            </Col>
            <Col md={4}>
              <Form.Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="mb-3"
              >
                <option value="all">All Levels</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? 'Cantrip' : `Level ${i}`}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Form>

        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p>
              {isFullyLoaded 
                ? 'Creating spell list. This may take a moment...' 
                : 'Loading spells (this may take a moment)...'}
            </p>
            <p>Loaded: {spells.length} spells</p>
          </div>
        ) : filteredSpells.length === 0 ? (
          <div className="text-center p-4">
            <p>No spells found matching your search criteria.</p>
          </div>
        ) : (
          <div className="spell-list" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <Row xs={1} md={2} className="g-4">
                {filteredSpells.map((spell) => (
              <Col key={spell.index}>
                <Card 
                  className={`h-100 ${selectedSpells.has(spell.index) ? 'border-primary' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body 
                    onClick={() => handleSpellClick(spell.index)}
                    className="d-flex flex-column"
                  >
                    <div>
                      <Card.Title className="d-flex justify-content-between">
                        {spell.name}
                        <span className="text-muted">
                          {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
                        </span>
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {spell.school.name}
                      </Card.Subtitle>
                      <Card.Text className="small">
                        Classes: {spell.classes.map(c => c.name).join(', ')}
                      </Card.Text>
                    </div>
                    
                    {spell.desc && spell.desc.length > 0 && (
                      <div 
                        className="mt-2 d-flex flex-column flex-grow-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div 
                          style={{ 
                            maxHeight: spell.index === expandedSpellId ? 'none' : '3.6em',
                            overflow: 'hidden',
                          }}
                        >
                          <Card.Text className="small text-muted mb-0">
                            {spell.desc[0]}
                          </Card.Text>
                        </div>
                        <div className="mt-auto pt-2 text-end">
                          {spell.index !== expandedSpellId ? (
                            <button
                              className="btn btn-link btn-sm p-0 text-primary"
                              style={{
                                border: 'none',
                                textDecoration: 'none'
                              }}
                              onClick={() => setExpandedSpellId(spell.index)}
                            >
                              Read More
                            </button>
                          ) : (
                            <button 
                              className="btn btn-link btn-sm p-0 text-muted"
                              onClick={() => setExpandedSpellId(null)}
                            >
                              Show Less
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleAddSpells}
          disabled={selectedSpells.size === 0}
        >
          Add Selected Spells ({selectedSpells.size})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SpellModal;