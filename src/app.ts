import express from 'express';

import usersRoutes from './routes/users';

const app = express();

app.use(express.json());

app.use('/users', usersRoutes);

app.get('*', (req, res) => {
  const err = {
    status: 404,
    message: 'URL not found',
  };

  res.status(404).json(err);
});

export default app;
