const Joi = require("joi");
const AppError = require("../utils/AppError");

// Validation schemas
const createClassSchema = Joi.object({
  name: Joi.string().required(),
  servants: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)), // Valid ObjectId pattern
  classIntercessor: Joi.optional(),
  moreInfo: Joi.optional(),
  grade: Joi.string().required(),
});

const updateClassSchema = Joi.object({
  name: Joi.string().optional(),
  servants: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional(),
  moreInfo: Joi.optional(),
  grade: Joi.optional(),
  classIntercessor: Joi.optional(),
}).min(1); // Ensure at least one field is being updated

const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required(); // For validating ObjectId

// Validation middlewares
const validateCreateClass = (req, res, next) => {
  const { error } = createClassSchema.validate(req.body);
  if (error) return next(new AppError(error.message, 400));
  next();
};

const validateUpdateClass = (req, res, next) => {
  const { error } = updateClassSchema.validate(req.body);
  if (error) return next(new AppError(error.message, 400));
  next();
};

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  const { error } = objectIdSchema.validate(id);
  if (error) return next(new AppError("Invalid ID format", 400));
  next();
};

module.exports = {
  validateCreateClass,
  validateUpdateClass,
  validateObjectId,
};
