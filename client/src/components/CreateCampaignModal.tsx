import React, { useState } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import { Modal, Button, Form, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';

// Types for Users and Characters
interface Character {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  username: string;
  characters: Character[];
}

interface CreateCampaignModalProps {
  show: boolean;
  onClose: () => void;
  onCampaignCreated: () => void;
}

// GraphQL Query to Fetch Users and Characters
const SEARCH_USERS = gql`
  query SearchUsers($term: String!) {
    searchUsers(term: $term) {
      _id
      username
      characters {
        _id
        name
      }
    }
  }
`;

// GraphQL Mutation to Add a Campaign
const ADD_CAMPAIGN = gql`
  mutation AddCampaign($name: String!, $description: String, $players: [ID!]!) {
    addCampaign(name: $name, description: $description, players: $players) {
      _id
      name
      description
      players {
        _id
        name
      }
      createdBy {
        _id
        username
      }
    }
  }
`;

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ show, onClose, onCampaignCreated }) => {
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<{ id: string; name: string; username: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchUsers, { data: searchResults }] = useLazyQuery(SEARCH_USERS);
  const [addCampaign, { loading: addingCampaign }] = useMutation(ADD_CAMPAIGN);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      return;
    }
    searchUsers({ variables: { term } });
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchTerm('');
  };

  const handleSelectCharacter = (characterId: string, characterName: string) => {
    if (!selectedMembers.some((member) => member.id === characterId) && selectedUser) {
      setSelectedMembers((prev) => [
        ...prev,
        { id: characterId, name: characterName, username: selectedUser.username },
      ]);
    }
    // Reset the user selection after selecting a character
    setSelectedUser(null);
  };

  const handleCreate = async () => {
    if (campaignName.trim() && campaignDescription.trim() && selectedMembers.length > 0) {
      try {
        await addCampaign({
          variables: {
            name: campaignName,
            description: campaignDescription,
            players: selectedMembers.map((member) => member.id), // Corrected to players
          },
        });
        onCampaignCreated(); // Trigger re-render of campaign list
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error creating campaign:', error);
      }
    } else {
      alert('Please complete all fields and select members.');
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
            {searchTerm && searchResults?.searchUsers && (
              <Dropdown.Menu show>
                {searchResults.searchUsers.map((user: User) => (
                  <Dropdown.Item key={user._id} onClick={() => handleSelectUser(user)}>
                    {user.username}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            )}
          </Form.Group>
          {selectedUser && (
            <Form.Group className="mb-3">
              <Form.Label>Select a Character from {selectedUser.username}</Form.Label>
              <DropdownButton title="Select Character" className="mb-3">
                {selectedUser.characters.map((character) => (
                  <Dropdown.Item
                    key={character._id}
                    onClick={() => handleSelectCharacter(character._id, character.name)}
                  >
                    {character.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Form.Group>
          )}
          {selectedMembers.length > 0 && (
            <Form.Group className="mt-3">
              <Form.Label>Selected Characters</Form.Label>
              <ul>
                {selectedMembers.map((member) => (
                  <li key={member.id}>
                    <strong>{member.name}</strong>
                    <br />
                    <small>Player: {member.username}</small>
                  </li>
                ))}
              </ul>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={addingCampaign}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreate} disabled={addingCampaign}>
          {addingCampaign ? 'Creating...' : 'Create Campaign'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCampaignModal;
