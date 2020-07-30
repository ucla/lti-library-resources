import * as constants from '../../constants';

const useUserRole = (idToken, role) => {
  if (idToken === {}) {
    return false;
  }
  else {
    return (idToken.roles[0].search(role) === -1 ? false : true);
  }
}

export const isUserAdmin = (idToken) => {
  return useUserRole(idToken, constants.ROLES.ADMIN);
}

export const isUserTeacher = (idToken) => {
  return useUserRole(idToken, constants.ROLES.TEACHER);
}

export const isUserStudent = (idToken) => {
  return useUserRole(idToken, constants.ROLES.STUDENT);
}
