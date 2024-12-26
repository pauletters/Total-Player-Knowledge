import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet, useNavigate } from 'react-router-dom';
import { onError } from '@apollo/client/link/error';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthService from './utils/auth';
import PersistentDiceRoller from './components/PersistentDiceRoller';
import DiceRoller from './components/DiceRoller';

// Construct our main GraphQL API endpoint
// This is the entry point for our application
// errorLink is a terminating link that will be executed when an error occurs in the link chain
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});
// Create an http link
const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'production'
  ? '/graphql'
  : 'http://localhost:3001/graphql',
  credentials: 'same-origin'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Instantiate Apollo Client
const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
 },
});

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.loggedIn()) {
      navigate('/my-characters');
    }
  }, [navigate]);
  
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
      {AuthService.loggedIn() && <PersistentDiceRoller DiceRoller={DiceRoller} />}
    </ApolloProvider>
  );
}

export default App;
