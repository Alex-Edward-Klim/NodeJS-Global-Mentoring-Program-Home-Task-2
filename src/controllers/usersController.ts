import { Request, Response } from 'express';

import getAutoSuggestUsers, {
  checkIfLoginAlreadyTaken,
  checkIfUserAlreadyExists,
  createNewUser,
  deleteUser,
  getUserById,
  updateUser,
  validateUserByAllFields,
  validateUserByOneField,
} from '../models/users';

const users_get_all = (req: Request, res: Response) => {
  const { limit, loginSubstring } = req.query;

  const users = getAutoSuggestUsers(loginSubstring, limit);

  if (!users) {
    res.status(400).send('Wrong "limit" query parameter');
  } else {
    res.json(users);
  }
};

const users_get_user = (req: Request, res: Response) => {
  const { id } = req.params;

  const user = getUserById(id);

  if (user) {
    res.send(user);
  } else {
    res.status(400).send('User not found');
  }
};

const users_create_user = (req: Request, res: Response) => {
  const error = validateUserByAllFields(req.body);

  if (error) {
    res.status(400).send(error.details);
  } else if (checkIfUserAlreadyExists(req.body)) {
    res.status(400).send('User already exists');
  } else {
    const newUser = createNewUser(req.body);
    res.send(newUser);
  }
};

const users_update_user = (req: Request, res: Response) => {
  const { id } = req.params;

  const user = getUserById(id);

  if (user) {
    const error = validateUserByOneField(req.body);
    if (error) {
      res.status(400).send(error.details);
    } else if (checkIfLoginAlreadyTaken(user, req.body.login)) {
      res.status(400).send('Login is already taken');
    } else {
      const updatedUser = updateUser(user, req.body);
      res.send(updatedUser);
    }
  } else {
    res.status(400).send('User not found');
  }
};

const users_delete_user = (req: Request, res: Response) => {
  const { id } = req.params;

  const user = getUserById(id);

  if (user) {
    deleteUser(user);
    res.send(user);
  } else {
    res.status(400).send('User not found');
  }
};

const usersController = {
  users_get_all,
  users_get_user,
  users_create_user,
  users_update_user,
  users_delete_user,
};

export default usersController;
