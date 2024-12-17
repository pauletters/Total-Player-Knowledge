  import { Container } from 'react-bootstrap';

  const About = () => {
    return (
        <div className="about-page">
          <div className="hero-section">
          <Container className="hero-content">
            <h1 className="hero-title">About</h1>
            <h2 className="hero-subtitle">Total Player Knowledge</h2>
            <h4 className="hero-subtitle">It's the TPK you'll actually want to experience!</h4>
          </Container>
        </div>

        <Container className="content-section">
          <p className="lead text-center">
          Welcome to TPK - your ultimate companion for character creation and campaign management.
          Join us to create, manage, and bring your characters to life!
        </p>
      </Container>
    </div>
    );
  };
  
  export default About;

