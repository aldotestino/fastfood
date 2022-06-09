import { ErrorCode } from './types';

class CustomError extends Error {
  code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
  }
}

export default CustomError;