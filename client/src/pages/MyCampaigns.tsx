import { Container } from 'react-bootstrap';
import UserMenu from '../components/UserMenu';

const MyCampaigns = () => {
  return (
    <>
      <UserMenu />
      <Container>
        <h1>My Campaigns</h1>
        {/* Add campaigns list here */}
      </Container>
    </>
  );
};

export default MyCampaigns;