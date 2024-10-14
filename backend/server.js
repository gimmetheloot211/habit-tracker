require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const habitRoutes = require('./routes/habitRoutes');
const userRoutes = require('./routes/userRoutes');
const weekRoutes = require('./routes/weekRoutes');

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}))

app.use('/api/accounts', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/weeks', weekRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(res => app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`)))
    .catch(err => console.log(err))
