import { error } from '../utils/responseHelper.js';

/**
 * Create a validation middleware from a validator function.
 * The validator function should return { isValid, errors } where errors is an array of strings.
 * @param {Function} validatorFn - (body) => { isValid: boolean, errors: string[] }
 */
export function validate(validatorFn) {
  return (req, res, next) => {
    const { isValid, errors: validationErrors } = validatorFn(req.body);

    if (!isValid) {
      return error(res, 'Validation failed', 400, validationErrors);
    }

    next();
  };
}
