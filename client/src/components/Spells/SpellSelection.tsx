import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Card, Row, Col, Pagination } from 'react-bootstrap';
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
  };

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
  const [expandedSpellId, setExpandedSpellId] = useState<string | null>(null);

   // Pagination state
   const [currentPage, setCurrentPage] = useState(1);
   const spellsPerPage = 12;

   // Progress tracking
  const [totalSpells, setTotalSpells] = useState(0);
  const [loadedSpells, setLoadedSpells] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState<'initial' | 'details'>('initial');

  useEffect(() => {
    const fetchAllSpells = async () => {
      if (!show || !characterClass) return;
      
      try {
        setLoading(true);
        setLoadingPhase('initial');
        setLoadedSpells(0);

        const classResponse = await dndApi.getSpellsByClass(characterClass) as SpellApiResponse;
        
        if (classResponse?.results) {
          setTotalSpells(classResponse.results.length);
          setLoadingPhase('details');
          
          // Fetch details for all spells with controlled concurrency
          const fetchSpellDetails = async (spellResults: typeof classResponse.results) => {
            const validSpells: Spell[] = [];

            let loadedCount = 0;

            for (const spell of spellResults) {
              loadedCount++;
                try {
                  // First try to get from cache
                  const cachedSpell = await spellCache.getSpell(spell.name);
                  if (cachedSpell) {
                    validSpells.push({
                      ...cachedSpell,
                      school: { name: cachedSpell.school.name },
                      classes: cachedSpell.classes || [] 
                    });
                    setLoadedSpells(loadedCount);
                    continue;
                  }
                  
                  // If not in cache, fetch from API
                  const spellIndex = spell.name.toLowerCase().replace(/\s+/g, '-');
                  const fetchedSpell =  await dndApi.getSpell(spellIndex) as Spell;
                  if (fetchedSpell) {
                    validSpells.push({
                      index: fetchedSpell.index,
                      name: fetchedSpell.name,
                      level: fetchedSpell.level,
                      school: { name: fetchedSpell.school.name },
                      classes: fetchedSpell.classes || [],
                      desc: fetchedSpell.desc
                    });
                  }

                  // Adds small delay between requests
                  await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                  console.warn(`Could not load spell ${spell.name}:`, error);
                  setLoadedSpells(loadedCount);
                }
              }

              return validSpells;
            };

          const pageSpellDetails = await fetchSpellDetails(classResponse.results);
          setSpells(pageSpellDetails || []);
        }
      } catch (error) {
        console.error('Error fetching spells:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSpells();
  }, [show, currentPage, spellsPerPage, characterClass]);

   // Reset pagination when filters change
   useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel]);

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
    spell.classes.some(c => c.name.toLowerCase() === characterClass.toLowerCase());
  const matchesLevel = selectedLevel === 'all' || spell.level === parseInt(selectedLevel);
  return matchesSearch && matchesClass && matchesLevel;
});

const totalPages = Math.ceil(filteredSpells.length / spellsPerPage);

// Get current page's spells
const indexOfLastSpell = currentPage * spellsPerPage;
const indexOfFirstSpell = indexOfLastSpell - spellsPerPage;
const currentSpells = filteredSpells.slice(indexOfFirstSpell, indexOfLastSpell);

  const renderPagination = () => {
    const items = [];
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(curr => Math.max(curr - 1, 1))}
      />
    );

    // First page
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => setCurrentPage(1)}
      >
        1
      </Pagination.Item>
    );

    // Ellipsis and middle pages
    if (totalPages > 5) {
      if (currentPage > 3) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Pagination.Item>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
    } else {
      // If fewer pages, show all
      for (let i = 2; i < totalPages; i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    // Last page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(curr => Math.min(curr + 1, totalPages))}
      />
    );

    return <Pagination className="justify-content-center mt-4">{items}</Pagination>;
  };

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
            <div className="mb-4">
              <h4 className="mb-3">
                {loadingPhase === 'initial' ? 'Loading Class Spells...' : 'Loading Spell Details'}
              </h4>
              <div className="progress mb-3" style={{ height: '25px' }}>
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                  role="progressbar"
                  style={{ width: `${(loadedSpells / Math.max(totalSpells, 1)) * 100}%` }}
                  aria-valuenow={(loadedSpells / Math.max(totalSpells, 1)) * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {Math.round((loadedSpells / Math.max(totalSpells, 1)) * 100)}%
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                <span className="text-muted fw-bold">
                  {loadedSpells} / {totalSpells} spells
                </span>
              </div>
            </div>
            <p className="text-muted small fst-italic">
              {loadingPhase === 'initial' 
                ? `Loading available spells for ${characterClass}...` 
                : 'Loading detailed information for each spell. This may take a moment.'}
            </p>
          </div>
        ) : filteredSpells.length === 0 ? (
          <div className="text-center p-4">
            <p>No spells found matching your search criteria.</p>
          </div>
        ) : (
          <>
          <div className="spell-list" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <Row xs={1} md={2} className="g-4">
                {currentSpells.map((spell) => (
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
        {renderPagination()}
        </>
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