const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcrypt');

const prisma = require('../src/lib/prisma');
const { login, register } = require('../src/controllers/auth.controller');

const originalEnv = process.env.NODE_ENV;
const originalUsuarioFindUnique = prisma.usuario.findUnique;
const originalUsuarioCreate = prisma.usuario.create;
const originalTokenCreate = prisma.tokenAcceso.create;

process.env.NODE_ENV = 'development';

function buildResponse() {
  return {
    statusCode: 200,
    body: null,
    json(payload) {
      this.body = payload;
      return payload;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
  };
}

test('login should allow a user with unverified email in development', async () => {
  prisma.usuario.findUnique = async () => ({
    id: 'u1',
    nombre: 'Ana',
    apellido: 'García',
    email: 'ana@test.com',
    passwordHash: await bcrypt.hash('abc12345', 10),
    emailVerificado: false,
    rol: 'CLIENTE',
  });

  const response = buildResponse();
  await login({ body: { email: 'ana@test.com', password: 'abc12345' } }, response);

  assert.equal(response.statusCode, 200);
  assert.ok(response.body.token);
  assert.equal(response.body.usuario.email, 'ana@test.com');
});

test('register should return token and user in development flow', async () => {
  prisma.usuario.findUnique = async () => null;
  prisma.usuario.create = async ({ data }) => ({
    id: 'u2',
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    rol: 'CLIENTE',
  });
  prisma.tokenAcceso.create = async () => ({ id: 't1' });

  const response = buildResponse();
  await register({ body: { nombre: 'Luis', apellido: 'Pérez', email: 'luis@test.com', password: 'abc12345', telefono: '1111' } }, response);

  assert.equal(response.statusCode, 201);
  assert.ok(response.body.token);
  assert.equal(response.body.usuario.email, 'luis@test.com');
});

process.on('exit', () => {
  prisma.usuario.findUnique = originalUsuarioFindUnique;
  prisma.usuario.create = originalUsuarioCreate;
  prisma.tokenAcceso.create = originalTokenCreate;
  if (originalEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalEnv;
});
