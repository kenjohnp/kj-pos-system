import Joi from "joi-browser";

const validate = (data, schema) => {
  const { error } = Joi.validate(data, schema, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (!error) return null;

  const errors = {};
  for (let item of error.details) errors[item.path[0]] = item.message;

  return errors;
};

export default validate;
