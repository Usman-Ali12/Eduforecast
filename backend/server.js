const express = require('express');
const cors = require('cors');
const app = express();
const loginRoute = require('./routes/login');

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth/login', loginRoute); // now handles POST /api/auth/login

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
