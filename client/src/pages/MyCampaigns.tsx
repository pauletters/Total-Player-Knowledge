import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
import CreateCampaignModal from '../components/CreateCampaignModal';

// GraphQL Query to Fetch Campaigns
const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns {
      _id
      name
      description
      players {
        _id
        basicInfo {
          name
        }
        player {
          _id
          username
        }
      }
      playerCount
    }
  }
`;

const MyCampaigns: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_CAMPAIGNS);
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateCampaignSubmit = () => {
    refetch(); // Refetch campaigns after creating a new one
    setShowCreateModal(false);
  };

  // Handle loading and error states
  if (loading) return <div>Loading campaigns...</div>;
  if (error) return <div>Error fetching campaigns: {error.message}</div>;

  const campaigns = data?.campaigns || [];

  const handleViewCampaign = (campaignId: string) => {
    // Navigate to the CampaignDashboard route with the campaignId
    navigate(`/my-campaigns/${campaignId}`);
  };

  return (
    <>
      <UserMenu />
      <Container>
        <h1 className="mb-4">My Campaigns</h1>

        <Row xs={1} md={2} lg={3} className="g-4">
          {/* Create Campaign Card */}
          <Col>
            <Card className="h-100" style={{ cursor: 'pointer' }}>
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Card.Title>Create a Campaign</Card.Title>
                <Button variant="outline-primary" onClick={handleCreateCampaign}>
                  Start Now
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Display Campaigns */}
          {campaigns.map((campaign: any) => (
            <Col key={campaign._id}>
              <Card>
                <Card.Body>
                  <Card.Title>{campaign.name}</Card.Title>
                  {campaign.description && (
                    <Card.Text>{campaign.description}</Card.Text>
                  )}
                  <Card.Text className="text-muted">
                    Players:
                    <ul>
                      {campaign.players.map((player: any) => (
                        <li key={player._id}>
                          <strong>{player.basicInfo.name}</strong>
                          <br />
                          <small>Player: {player.player.username}</small>
                        </li>
                      ))}
                    </ul>
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewCampaign(campaign._id)}
                    >
                      View
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        show={showCreateModal}
        onClose={handleCloseCreateModal}
        onCampaignCreated={handleCreateCampaignSubmit}
      />
    </>
  );
};

export default MyCampaigns;
