import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieSchema from './schemas/schema.js';
import movieResolvers from './resolvers/resolvers.js';
import mongoose from 'mongoose';

//import ApolloServer
import { ApolloServer }  from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
// Express app
const app = express();

//Store sensitive information to env variables
dotenv.config();
//console.log(process.env);

// MongoDB connection string from .env (Option B)
const connectDB = async () => {
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not set in .env');
    }
    await mongoose.connect(MONGODB_URI);
};

async function startServer() {
    //Define Apollo Server
    const server = new ApolloServer({
      typeDefs: movieSchema,
      resolvers: movieResolvers
    });

    //Start the Apollo Server
    await server.start();

    //Apply middleware to the Express app
    app.use(
      '/graphql', 
      cors(),
      express.json(),
      expressMiddleware(server)
    );

    //Start Express server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/graphql`);
      //Connect to MongoDB Atlas
      try {
          connectDB()
          console.log('Connected to MongoDB Atlas');
      } catch (error) {
        console.log(`Unable to connect to DB : ${error.message}`);
      }
    })
}

startServer();