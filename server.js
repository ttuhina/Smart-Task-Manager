const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/todos', require('./routes/todos'));
app.use(express.static('public'));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});