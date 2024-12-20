import { useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import UserMenu from '../components/UserMenu';

// You might want to create a type for your campaigns
interface Campaign {
  id: string;
  name: string;
  members: string[];
}

const MyCampaigns = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Placeholder for campaigns - in a real app, this would come from state management or API
  const [campaigns] = useState<Campaign[]>([
    { id: '1', name: 'Adventure Squad', members: ['Alice', 'Bob', 'Charlie'] },
    { id: '2', name: 'Dragon Slayers', members: ['John', 'Doe', 'Smith'] },
  ]);

  const handleCreateCampaign = () => {
    // Navigate to the campaign creation page
    navigate('/my-campaigns/campaign-creation');
  };

  const handleViewCampaign = (campaignId: string) => {
    navigate(`/my-campaigns/${campaignId}`);
  };

  // Check if we're on the campaign creation route or viewing a campaign
  const isCreatingCampaign = location.pathname.includes('/campaign-creation');
  const isViewingCampaign = location.pathname.split('/').length > 2 && !isCreatingCampaign;

  return (
    <>
      <UserMenu />
      <Container>
        {!isCreatingCampaign && !isViewingCampaign && (
          <>
            <h1 className="mb-4">My Campaigns</h1>

            {campaigns.length === 0 ? (
              <div className="text-center">
                <p>You haven't created any campaigns yet.</p>
                <Button 
                  variant="outline-primary" 
                  onClick={handleCreateCampaign}
                >
                  Create Your First Campaign
                </Button>
              </div>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {/* Hardcoded Create Campaign Card */}
                <Col>
                  <Card
                    className="h-100"
                    onClick={handleCreateCampaign}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                      <Card.Title>Create a Campaign</Card.Title>
                      <Button variant="outline-primary">Start Now</Button>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Existing Campaigns */}
                {campaigns.map((campaign) => (
                  <Col key={campaign.id}>
                    <Card>
                      <Card.Body>
                        <Card.Title>{campaign.name}</Card.Title>
                        <Card.Text className="text-muted">
                          Members:
                          <ul>
                            {campaign.members.map((member, idx) => (
                              <li key={idx}>{member}</li>
                            ))}
                          </ul>
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewCampaign(campaign.id)}
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

export default MyCampaigns;
