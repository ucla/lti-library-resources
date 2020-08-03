import * as constants from '../../constants';

const checkUserRole = (idToken, role) => {
  try {
    return idToken.roles[0].search(role) !== -1;
  } catch {
    return false;
  }
};

export const isUserAdmin = idToken =>
  checkUserRole(idToken, constants.ROLES.ADMIN);

export const isUserTeacher = idToken =>
  checkUserRole(idToken, constants.ROLES.TEACHER);

export const isUserStudent = idToken =>
  checkUserRole(idToken, constants.ROLES.STUDENT);
