import express from 'express';

import usersRoutes from './routes/users';

const app = express();

app.use((req, res, next) => {
  express.json()(req, res, (err) => {
    if (err) {
      return res.sendStatus(400);
    }

    return next();
  });
});

app.use('/users', usersRoutes);

app.get('*', (req, res) => {
  const err = {
    status: 404,
    message: 'URL not found',
  };

  res.status(404).json(err);
});

export default app;
