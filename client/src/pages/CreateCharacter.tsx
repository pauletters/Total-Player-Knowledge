import { Container } from 'react-bootstrap';
import UserMenu from '../components/UserMenu';

const CreateCharacter = () => {
  return (
    <>
      <UserMenu />
      <Container>
        <h1>Create New Character</h1>
        {/* Add character creation form here */}
      </Container>
    </>
  );
};

export default CreateCharacter;