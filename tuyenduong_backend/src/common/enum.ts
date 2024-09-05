export enum CriteriaType {
  HARD = 'hard',
  SOFT = 'soft',
}
export enum CriteriaSign {
  LESS = '<', 
  MORE = '>', 
  LESSEQUAL = '<=',
  MOREEQUAL = '>=',
  NULL = '',
}

export enum Role {
  PARTICIPANT = 'participant',
  ADMIN = 'admin',
  DEPARTMENT = 'department',
  MANAGER = 'manager',
}

export enum Lock {
  UNLOCK = '',
  TEMPORARY = 'temporary',
  FOREVER = 'forever',
  UNAVAILABLE = 'unavailable',
}

export enum StatusRegistration {
  REGISTERED = 'REGISTERED',
  CANCEL = 'CANCEL',
  PASS = 'PASS',
  NOPASS = 'NOPASS',
}

export enum TypeOb {
  ACHIEVEMENT = 'ACHIEVEMENT',
}
