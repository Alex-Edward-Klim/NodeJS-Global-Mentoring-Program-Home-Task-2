import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

import users from '../dataBase/users';
import { User } from '../types/user';

export const getUserById = (id: string) => users.find(
  (userObject) => userObject.id === id && userObject.isDeleted === false,
);

export const deleteUser = (user: User) => {
  user.isDeleted = true;
};

export const validateUserByAllFields = (user: User) => {
  const schema = Joi.object({
    login: Joi.string().alphanum().required(),

    password: Joi.string()
      .pattern(/[A-Za-z0-9]*([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+)/)
      .required(),

    age: Joi.number().integer().min(4).max(130)
      .required(),
  });

  const { error } = schema.validate(user, { abortEarly: false, allowUnknown: false });

  return error;
};

export const validateUserByOneField = (user: User) => {
  const schema = Joi.object({
    login: Joi.string().alphanum(),

    password: Joi.string()
      .pattern(/[A-Za-z0-9]*([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+)/),

    age: Joi.number().integer().min(4).max(130),
  }).min(1);

  const { error } = schema.validate(user, { abortEarly: false, allowUnknown: false });

  return error;
};

export const checkIfLoginAlreadyTaken = (user: User, login: string) => user.login !== login
  && users.some((userObject) => userObject.login === login
  && user.isDeleted === false);

export const checkIfUserAlreadyExists = (user: User) => users.some(
  (userObject) => userObject.login === user.login && userObject.isDeleted === false,
);

export const createNewUser = (user: User) => {
  const { login, password, age } = user;

  const newUser = {
    login,
    password,
    age: Number(age),
    id: uuidv4(),
    isDeleted: false,
  };

  users.push(newUser);

  return newUser;
};

export const updateUser = (user: User, newUserData: User) => {
  const { login, password, age } = newUserData;

  Object.assign(user, {
    login: login ?? user.login,
    password: password ?? user.password,
    age: Number(age ?? user.age),
  });

  return user;
};

const sortUsersAscending = (a: User, b: User) => {
  if (a.login < b.login) {
    return -1;
  }
  if (b.login > a.login) {
    return 1;
  }
  return 0;
};

const getAutoSuggestUsers = (loginSubstring: any = undefined, limit: any = undefined) => {
  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
    return null;
  }

  const notDeletedUsers = users.filter((user) => user.isDeleted === false);

  if (limit !== undefined && loginSubstring === undefined) {
    const limitNum = Number(limit);

    const sortedArr = [...notDeletedUsers].sort(sortUsersAscending);

    return sortedArr.slice(0, limitNum);
  } if (loginSubstring !== undefined && limit === undefined) {
    const filteredArr = notDeletedUsers.filter((user) => user.login.includes(loginSubstring));
    // const filteredArr = notDeletedUsers.filter(
    //  user => user.login.toLocaleUpperCase().includes(loginSubstring.toLocaleUpperCase()));

    const sortedAndFilteredArr = filteredArr.sort(sortUsersAscending);

    return sortedAndFilteredArr;
  } if (loginSubstring !== undefined && limit !== undefined) {
    const limitNum = Number(limit);

    const filteredArr = notDeletedUsers.filter((user) => user.login.includes(loginSubstring));
    // const filteredArr = notDeletedUsers.filter(
    //  user => user.login.toLocaleUpperCase().includes(loginSubstring.toLocaleUpperCase()));

    const sortedAndFilteredArr = filteredArr.sort(sortUsersAscending);

    return sortedAndFilteredArr.slice(0, limitNum);
  }

  return notDeletedUsers;
};

export default getAutoSuggestUsers;
