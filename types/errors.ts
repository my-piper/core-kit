import { Expose, objectTransformer, Transform } from "../packages/transform";

export class MemoryLimitError extends Error {
  constructor(message: string = "Memory limit exceeded", stack?: string) {
    super(message);
    this.stack = stack;
  }
}

export class FatalError extends Error {
  constructor(message: string = "Fatal error", stack?: string) {
    super(message);
    this.stack = stack;
  }
}

export class UnknownError extends Error {
  constructor(message: string = "Unknown error", stack?: string) {
    super(message);
    this.stack = stack;
  }
}

export class PenTestingError extends Error {
  constructor(message: string = "Pen testing error") {
    super(message);
  }
}

export class DataError extends Error {
  @Expose()
  @Transform(objectTransformer)
  details: object | object[];

  constructor(
    message: string = "Data error",
    details: object = {},
    stack?: string
  ) {
    super(message);
    this.details = details;
    this.stack = stack;
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not found") {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
  }
}

export class TooManyRequestsError extends Error {
  constructor(message: string = "Too many requests") {
    super(message);
  }
}

export class TimeoutError extends Error {
  constructor(message: string = "Task timeout", stack?: string) {
    super(message);
    this.stack = stack;
  }
}

export class UnexpectedTimeout extends Error {
  constructor(message: string) {
    super(message);
  }
}
