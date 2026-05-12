import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Sign a JWT token with the given payload.
 * @param {object} payload - { id, role }
 * @returns {string} JWT token
 */
export function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {object} decoded payload
 */
export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
