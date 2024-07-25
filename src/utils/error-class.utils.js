export class ErrorHandel {
  constructor(message, status,data, stack ) {
    this.message = message
    this.status = status
    this.data = data
    this.stack = stack
  }
}