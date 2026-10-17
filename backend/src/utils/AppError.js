// UTILIDAD
// Error propio de la aplicación: lleva un mensaje y un código HTTP (400, 404, 409...). Los services lo usan para avisar qué salió mal.

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }

  static badRequest = (message) => new AppError(400, message);
  static unauthorized = (message) => new AppError(401, message);
  static forbidden = (message) => new AppError(403, message);
  static notFound = (message) => new AppError(404, message);
  static conflict = (message) => new AppError(409, message);
}

export default AppError;
