import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import cors from 'cors';
import { GraphQLFormattedError } from 'graphql';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const startApolloServer = async () => {

  // Create a new ApolloServer instance with the schema definition and resolvers
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError: GraphQLFormattedError) => {
      console.error('GraphQL Error Details:', {
        message: formattedError.message,
        locations: formattedError.locations,
        path: formattedError.path,
        extensions: formattedError.extensions
      });
      return formattedError;
    },
  });

  await server.start();
  await db();
console.log('Connected to the database!');

  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    '/graphql',
    cors({
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
    }),
    expressMiddleware(server, {
      context: async ({ req }) => authenticateToken({ req })
    })
  );

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
    console.log('Static files being served from:', clientDistPath);
    
    app.use(express.static(clientDistPath));

    app.get('*', (_req: Request, res: Response) => {
      const indexPath = path.join(clientDistPath, 'index.html');
      console.log('Attempting to serve index.html from:', indexPath);
      res.sendFile(indexPath);
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`🚀 GraphQL ready at http://localhost:${PORT}/graphql`);
});
}
  console.log('Apollo Server successfully started!');


startApolloServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
