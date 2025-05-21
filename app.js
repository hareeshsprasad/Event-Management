require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose.set('debug', true);
const app = express();
const routes = require('./src');

app.use(express.json());
app.use('/api', routes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});