export class FatalError extends Error {
  constructor(message: string = "Fatal error") {
    super(message);
  }
}
export class UnknownError extends Error {
  constructor(message: string = "Unknown error") {
    super(message);
  }
}

export class PenTestingError extends Error {
  constructor(message: string = "Pen testing error") {
    super(message);
  }
}

export class DataError extends Error {
  constructor(message: string = "Data error") {
    super(message);
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

export class JobTimeout extends Error {
  constructor(message: string = "Task timeout") {
    super(message);
  }
}

export class UnexpectedTimeout extends Error {
  constructor(message: string) {
    super(message);
  }
}
