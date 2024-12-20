import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';

// Types for Users and Characters
interface Character {
  id: string;
  name: string;
}

interface User {
  id: string;
  username: string;
  characters: Character[];
}

interface CreateCampaignModalProps {
  show: boolean;
  onClose: () => void;
  onCreateCampaign: (campaign: { name: string; description: string; members: string[] }) => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ show, onClose, onCreateCampaign }) => {
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]); // Character IDs

  // Simulated search function (replace with your API call)
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }
    // Replace with a real API call to fetch users and their characters
    const results: User[] = [
      {
        id: '1',
        username: 'Alice',
        characters: [{ id: 'c1', name: 'Archer' }, { id: 'c2', name: 'Mage' }],
      },
      {
        id: '2',
        username: 'Bob',
        characters: [{ id: 'c3', name: 'Warrior' }],
      },
    ];
    setSearchResults(results);
  };

  const handleSelectCharacter = (characterId: string) => {
    if (!selectedMembers.includes(characterId)) {
      setSelectedMembers((prev) => [...prev, characterId]);
    }
  };

  const handleRemoveCharacter = (characterId: string) => {
    setSelectedMembers((prev) => prev.filter((id) => id !== characterId));
  };

  const handleCreate = () => {
    if (campaignName.trim() && campaignDescription.trim()) {
      onCreateCampaign({
        name: campaignName,
        description: campaignDescription,
        members: selectedMembers,
      });
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Campaign</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Campaign Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter campaign name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Campaign Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              maxLength={100}
              placeholder="Enter a short description (max 100 characters)"
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
            />
            <Form.Text>{100 - campaignDescription.length} characters remaining</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Search for Users</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search users by name"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
          <Row>
            {searchResults.map((user) => (
              <Col key={user.id} md={6}>
                <h5>{user.username}</h5>
                <ul>
                  {user.characters.map((character) => (
                    <li key={character.id}>
                      <Button
                        variant={selectedMembers.includes(character.id) ? 'success' : 'outline-primary'}
                        size="sm"
                        className="me-2 mb-2"
                        onClick={() =>
                          selectedMembers.includes(character.id)
                            ? handleRemoveCharacter(character.id)
                            : handleSelectCharacter(character.id)
                        }
                      >
                        {selectedMembers.includes(character.id) ? 'Selected' : 'Select'} - {character.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </Col>
            ))}
          </Row>
          {selectedMembers.length > 0 && (
            <Form.Group className="mt-3">
              <Form.Label>Selected Characters</Form.Label>
              <ul>
                {selectedMembers.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Create Campaign
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCampaignModal;
