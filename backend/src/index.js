const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/pecas',     require('./routes/pecas'));
app.use('/api/atores',    require('./routes/atores'));
app.use('/api/sessoes',   require('./routes/sessoes'));
app.use('/api/ingressos', require('./routes/ingressos'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});