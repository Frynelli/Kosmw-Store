// export default clientPromise;
import { MongoClient, ServerApiVersion } from 'mongodb';

// Ensure the MongoDB URI is set in the environment variables
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Create a new MongoClient only if not already created, in the context of development
if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    console.log('Creating new MongoClient for development');
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect().catch(error => {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    });
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production, always create a new MongoClient
  console.log('Creating new MongoClient for production');
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch(error => {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  });
}

// Log successful connection
clientPromise.then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Failed to connect to MongoDB:', error);
});

export default clientPromise;
