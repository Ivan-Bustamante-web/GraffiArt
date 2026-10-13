const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcrypt');

const { AppDataSource } = require('../src/lib/data-source');
const { login, register } = require('../src/controllers/auth.controller');

const originalEnv = process.env.NODE_ENV;
const originalGetRepository = AppDataSource.getRepository;
const mockRepos = (repos) => {
  AppDataSource.getRepository = (name) => repos[name];
};

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

test('login should request verification for a user with unverified email', async () => {
  const passwordHash = await bcrypt.hash('abc12345', 10);
  mockRepos({
    usuario: {
      findOneBy: async () => ({
        id: 'u1',
        nombre: 'Ana',
        apellido: 'García',
        email: 'ana@test.com',
        passwordHash,
        emailVerificado: false,
        rol: 'CLIENTE',
      }),
    },
  });

  const response = buildResponse();
  await login({ body: { email: 'ana@test.com', password: 'abc12345' } }, response);

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.needsVerification, true);
  assert.equal(response.body.email, 'ana@test.com');
});

test('register should return a verification token in development flow', async () => {
  mockRepos({
    usuario: {
      findOneBy: async () => null,
      create: (data) => data,
      save: async (data) => ({ id: 'u2', rol: 'CLIENTE', ...data }),
    },
    tokenacceso: {
      create: (data) => data,
      save: async (data) => ({ id: 't1', ...data }),
    },
  });

  const response = buildResponse();
  await register({ body: { nombre: 'Luis', apellido: 'Pérez', email: 'luis@test.com', password: 'abc12345', telefono: '1111' } }, response);

  assert.equal(response.statusCode, 201);
  assert.ok(response.body.token);
  assert.match(response.body.verificationUrl, /\/verificar-email\?token=/);
});

process.on('exit', () => {
  AppDataSource.getRepository = originalGetRepository;
  if (originalEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalEnv;
});
