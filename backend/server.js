import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 
import transactionRoutes from './routes/transactions.js';

const app = express();
const PORT = 5000;


app.use(cors()); 


mongoose.connect('mongodb://localhost:27017/mernstack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Middleware for parsing JSON
app.use(express.json());


app.use('/api/transactions', transactionRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
