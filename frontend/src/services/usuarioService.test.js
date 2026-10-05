import test from 'node:test';
import assert from 'node:assert/strict';

const { buildAuthHeaders } = await import('./usuarioService.js');

test('buildAuthHeaders agrega el token como Bearer si existe en localStorage', () => {
  global.localStorage = {
    getItem: (key) => (key === 'token' ? 'abc123' : null),
  };

  assert.deepEqual(buildAuthHeaders(), {
    Authorization: 'Bearer abc123',
    'Content-Type': 'application/json',
  });
});

test('buildAuthHeaders devuelve solo Content-Type si no hay token', () => {
  global.localStorage = {
    getItem: () => null,
  };

  assert.deepEqual(buildAuthHeaders(), {
    'Content-Type': 'application/json',
  });
});
