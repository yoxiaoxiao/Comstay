const { validationResult } = require('express-validator');
const { check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) { 
      const errors = {};
      validationErrors
        .array()
        .forEach(error => errors[error.path] = error.msg);
  
      const err = Error("Bad Request");
      err.errors = errors;
      err.status = 400;
      err.title = "Bad Request";
      next(err);
    }
    next();
  };
  
const validateReviews = [
  check('review').exists({ checkFalsy: true }).withMessage("Review Text is required"),
  check('stars').isLength({ min: 1, max: 5 }).withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];

const validateQueryValues = [
  check('page').optional().isInt({ min: 1 }).withMessage('Page must be greater than or equal to 1'),
  check('size').optional().isInt({ min: 1 }).withMessage('Size must be greater or equal to 1'),
  check('maxLat').optional().isFloat({ max: 90 }).withMessage('Maximum latitude is invalid'),
  check('minLat').optional().isFloat({ min: -90 }).withMessage('Minimum latitude is invalid'),
  check('maxLng').optional().isFloat({ max: 180 }).withMessage('Maximum longitude is invalid'),
  check('minLng').optional().isFloat({ min: -180 }).withMessage('Minimum longitude is invalid'),
  check('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be greater than or equal to 0'),
  check('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be greater than or equal to 0'),
  check('minPrice').optional().isFloat({ max: 'maxPrice' }).withMessage('Minimum price must be lower than Maximum.'),
  check('maxPrice').optional().isFloat({ min: 'minPrice' }).withMessage('Maximum price must be greater than Minimum.'),
  handleValidationErrors
];

const reviewCreationValidation = async (req, res, next) => {
  const { id } = req.user;
  const { reviewId } = req.params;
  try {
      const review = await Review.findByPk(reviewId);

      if (!review) {
          return res.status(404).json({
              message: "Review couldn't be found"
          })
      }

      if (review.userId !== id) {
          const err = new Error('Unauthorized');
          err.status = 403;
          err.title = 'Forbidden';
          return next(err);
      }

      next();
  } catch (error) {
      next(error)
  }
};
  module.exports = {
    validateReviews,
    validateQueryValues,
    reviewCreationValidation,
    handleValidationErrors
  };