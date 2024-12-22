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

 // Reset selections when modal closes
 useEffect(() => {
    if (!show) {
      setSelectedSpells(new Set());
      setSearchTerm('');
      setSelectedLevel('all');
    }
  }, [show]);

  useEffect(() => {
    const fetchSpells = async () => {
      if (!show) return;
      
      try {
        setLoading(true);
        const response = await dndApi.getSpells() as SpellApiResponse;
        if (response.results) {
          const initialSpellsPromises = response.results.map(async spellRef => {
            const cachedSpell = await spellCache.getSpell(spellRef.name);
            if (cachedSpell) {
              return cachedSpell;
            }
            return dndApi.getSpell(spellRef.index) as Promise<Spell>;
          });

          const initialSpells = (await Promise.all(initialSpellsPromises))
            .filter((spell): spell is Spell => spell !== null);
          
          setSpells(initialSpells);
        }
      } catch (error) {
        console.error('Error fetching spells:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpells();
  }, [show]);

  useEffect(() => {
    if (!show) {
      setSelectedSpells(new Set());
      setSearchTerm('');
      setSelectedLevel('all');
    }
  }, [show]);

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
    const matchesSearch = spell.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !characterClass || 
      spell.classes.some(c => c.name.toLowerCase() === characterClass.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || spell.level === parseInt(selectedLevel);
    return matchesSearch && matchesClass && matchesLevel;
  });

  return (
    <Modal show={show} onHide={onClose} size="lg">
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
          </div>
        ) : (
          <div className="spell-list" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <Row xs={1} md={2} className="g-4">
              {filteredSpells.map((spell) => (
                <Col key={spell.index}>
                  <Card 
                    className={`h-100 ${selectedSpells.has(spell.index) ? 'border-primary' : ''}`}
                    onClick={() => handleSpellClick(spell.index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between">
                        {spell.name}
                        <span className="text-muted">
                          {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
                        </span>
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {spell.school.name}
                      </Card.Subtitle>
                      {spellDetails[spell.index]?.desc && (
                        <Card.Text className="small">
                          {spellDetails[spell.index].desc[0].substring(0, 100)}...
                        </Card.Text>
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