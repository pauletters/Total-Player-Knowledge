import { Container } from 'react-bootstrap';
import UserMenu from '../components/UserMenu';

const MyCharacters = () => {
  return (
    <>
      <UserMenu />
      <Container>
        <h1>My Characters</h1>
        {/* Add character list here */}
      </Container>
    </>
  );
};

export default MyCharacters;