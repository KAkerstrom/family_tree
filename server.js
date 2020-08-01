const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const cors = require('cors');
connectDB();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ extended: false }));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trees', require('./routes/trees'));
app.use('/api/trees/:treeId/relatives', require('./routes/relatives'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;
const listener = app.listen(PORT, () =>
  console.log(`Server started on port ${listener.address().port}`)
);
