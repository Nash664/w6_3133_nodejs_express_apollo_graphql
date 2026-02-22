import MovieModel from '../models/Movie.js';

const buildUpdatePayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => typeof value !== 'undefined')
  );

// Resolvers define the technique for fetching the types defined in the schema.
const movieResolvers = {
  Query: {
    movies: async () => MovieModel.find(),
    movie: async (_, { id }) => MovieModel.findById(id),
    moviesByDirector: async (_, { director_name }) =>
      MovieModel.findByDirector(director_name),
  },
  Mutation: {
    addMovie: async (_, args) => MovieModel.create(args),
    updateMovie: async (_, { id, ...updates }) =>
      MovieModel.findByIdAndUpdate(id, buildUpdatePayload(updates), {
        new: true,
        runValidators: true,
      }),
    deleteMovie: async (_, { id }) => MovieModel.findByIdAndDelete(id),
  },
};

export default movieResolvers;