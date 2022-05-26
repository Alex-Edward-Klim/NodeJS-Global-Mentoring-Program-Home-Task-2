import users from '../dataBase/users';

const getAutoSuggestUsers = (loginSubstring: any = undefined, limit: any = undefined) => {
  const notDeletedUsers = users.filter((user) => user.isDeleted === false);

  if (limit !== undefined && loginSubstring === undefined) {
    const limitNum = Number(limit);

    const sortedArr = [...notDeletedUsers].sort((a, b) => {
      if (a.login < b.login) {
        return -1;
      }
      if (b.login > a.login) {
        return 1;
      }
      return 0;
    });

    return sortedArr.slice(0, limitNum);
  } if (loginSubstring !== undefined && limit === undefined) {
    const filteredArr = notDeletedUsers.filter((user) => user.login.includes(loginSubstring));
    // const filteredArr = notDeletedUsers.filter(
    //  user => user.login.toLocaleUpperCase().includes(loginSubstring.toLocaleUpperCase()));

    const sortedAndFilteredArr = filteredArr.sort((a, b) => {
      if (a.login < b.login) {
        return -1;
      }
      if (b.login > a.login) {
        return 1;
      }
      return 0;
    });

    return sortedAndFilteredArr;
  } if (loginSubstring !== undefined && limit !== undefined) {
    const limitNum = Number(limit);

    const filteredArr = notDeletedUsers.filter((user) => user.login.includes(loginSubstring));
    // const filteredArr = notDeletedUsers.filter(
    //  user => user.login.toLocaleUpperCase().includes(loginSubstring.toLocaleUpperCase()));

    const sortedAndFilteredArr = filteredArr.sort((a, b) => {
      if (a.login < b.login) {
        return -1;
      }
      if (b.login > a.login) {
        return 1;
      }
      return 0;
    });

    return sortedAndFilteredArr.slice(0, limitNum);
  }

  return notDeletedUsers;
};

export default getAutoSuggestUsers;
