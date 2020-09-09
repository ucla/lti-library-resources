import * as constants from '../../constants';

const checkUserRole = (context, role) => {
  try {
    return context.roles[0].search(role) !== -1;
  } catch {
    return false;
  }
};

export const isUserAdmin = context =>
  checkUserRole(context, constants.ROLES.ADMIN);

export const isUserTeacher = context =>
  checkUserRole(context, constants.ROLES.TEACHER);

export const isUserStudent = context =>
  checkUserRole(context, constants.ROLES.STUDENT);
