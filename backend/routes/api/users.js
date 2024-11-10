const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
    check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First name is required.')
    .isLength({ min: 1 })
    .withMessage('First name must be at least 1 characters long.'),
    check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last name is required.')
    .isLength({ min: 1 })
    .withMessage('Last name must be at least 1 characters long.'),
  handleValidationErrors
];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });
  
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

  // Get current user info
  router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findByPk(userId, {
        attributes: ['id', 'firstName', 'lastName', 'email', 'username'],
      });
      res.status(200).json({User: user || null});
    } catch (error) {
      res.status(500).json({error:'Internal Server Error'});
    }
  });

  // Log in a User
  router.post('/login', async (req, res) => {
    const { credential, password } = req.body;

      if (!credential || !password) {
        return res.status(400).json({
          "message": "Bad Request",
          "errors": {
            "credential": "Email or username is required",
            "password": "Password is required"
          }
        });
      }

      const user = await User.findOne({
        where: { 
          [Sequelize.Op.or]: [{ email: credential }, { username: credential }] 
        }
      });

      if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username
        }
      });
  });


  module.exports = router;
