const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models'); 
const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll(); 
  res.status(200).json({ Spots: spots });
});

// Get all spots owned by the current user
router.get('/users/:userId/spots', requireAuth, (req, res, next) => {
    const { userId } = req.params; 
    
    if (req.user.id !== parseInt(userId)) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.message = 'You are not authorized to access this resource.';
      return next(err); 
    }
  
    Spot.findAll({
      where: { userId: userId }
    })
      .then(spots => {
        return res.status(200).json({ Spots: spots.length > 0 ? spots : [] });
      })
      .catch(next); 
  });

// Get details of a spot from an id
router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params; 

    const spot = await Spot.findOne({
      where: { id: spotId },
      include: [
        {
          model: SpotImage,
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'], 
        },
      ],
    });
  
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err); 
    }
 
    return res.status(200).json({
      id: spot.id,
      userId: spot.userId, 
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: spot.numReviews || 0, 
      avgStarRating: spot.avgStarRating || 1, 
      SpotImages: spot.SpotImages.map(image => ({
        id: image.id,
        url: image.url,
        preview: image.preview,
      })),
      User: { 
        id: spot.User.id,
        firstName: spot.User.firstName,
        lastName: spot.User.lastName,
      },
    });
  });
  
// Create a spot
router.post('/spots', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
  
    const errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
    if (lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
    if (name.length > 50) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (price <= 0) errors.price = "Price per day must be a positive number";
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Bad Request", errors });
    }
  
    try {
      const spot = await Spot.create({
        userId: req.user.id, 
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      });
  
      return res.status(201).json({
        id: spot.id,
        userId: spot.userId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
      });
    } catch (error) {
      console.error(error);
      next(error); 
    }
  });

module.exports = router;
