import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import users from '../dataBase/users';
import getAutoSuggestUsers from '../controllers/users';

const router = express.Router();

// GET
router.get('/', (req, res) => {
  const { limit, loginSubstring } = req.query;

  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
    res.status(400).send('Wrong "limit" query parameter');
  } else {
    res.json(getAutoSuggestUsers(loginSubstring, limit));
  }
});
//

// GET :id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const user = users.find((userObject) => userObject.id === id && userObject.isDeleted === false);

  if (user) {
    res.send(user);
  } else {
    res.status(400).send('User not found');
  }
});
//

// Patch
router.patch('/:id', (req, res) => {
  const { id } = req.params;

  const user = users.find((userObject) => userObject.id === id && userObject.isDeleted === false);

  if (user) {
    const schema = Joi.object({
      login: Joi.string().alphanum(),

      password: Joi.string()
        // .pattern(new RegExp('[A-Za-z0-9]*([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+)')),
        .pattern(/[A-Za-z0-9]*([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+)/),

      age: Joi.number().integer().min(4).max(130),
    }).min(1);

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

    if (error) {
      res.status(400).send(error.details[0].message);
    } else if (user.login !== req.body.login
        && users.some((userObject) => userObject.login === req.body.login
        && user.isDeleted === false)) {
      res.status(400).send('Login is already taken');
    } else {
      const { login, password, age } = req.body;

      Object.assign(user, {
        login: login ?? user.login,
        password: password ?? user.password,
        age: Number(age ?? user.age),
      });

      res.send(user);
    }
  } else {
    res.status(400).send('User not found');
  }
});
//

// DELETE
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const user = users.find((userObject) => userObject.id === id && userObject.isDeleted === false);

  if (user) {
    user.isDeleted = true;
    res.send(user);
  } else {
    res.status(400).send('User not found');
  }
});
//

// POST
router.post('/', (req, res) => {
  const schema = Joi.object({
    login: Joi.string().alphanum().required(),

    password: Joi.string()
      // .pattern(new RegExp('[A-Za-z0-9]*([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+)'))
      .pattern(/[A-Za-z0-9]*([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+)/)
      .required(),

    age: Joi.number().integer().min(4).max(130)
      .required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

  if (error) {
    res.status(400).send(error.details[0].message);
  } else if (users.some((user) => user.login === req.body.login && user.isDeleted === false)) {
    res.status(400).send('User already exists');
  } else {
    const { login, password, age } = req.body;

    const newUser = {
      login,
      password,
      age: Number(age),
      id: uuidv4(),
      isDeleted: false,
    };

    users.push(newUser);

    res.send(newUser);
  }
});
//

export default router;
