export enum ErrorCode {
  INVALID_EMAIL=404,
  EMAIL_IN_USE=400,
  SERVER_ERROR=500,
  WRONG_PASSWORD=400,
  UNAUTHORIZED=401,
  VALIDATION_ERROR=422
}

export enum UserRole {
  ADMIN='ADMIN',
  COOK='COOK',
  CLIENT='CLIENT'
}

export enum Cookies {
  TOKEN='access-token',
  ROLE='user-role'
}