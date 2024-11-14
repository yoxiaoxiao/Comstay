const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { validateQueryValues, validateReview } = require('../../utils/validation')
const { Spot, SpotImage, User } = require('../../db/models'); 
const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll(); 
  res.status(200).json({ Spots: spots });
});

// Get all spots owned by the current user
router.get('/current',requireAuth, async (req,res) => {
  let Spots = await Spot.findAll({
      where: { ownerId: req.user.id }
  });
  if(!Spots){
      return res.status(404).json({
          message: "Spot couldn't be found",
          statusCode: 404
      });
  }
  return res.status(200).json({Spots});
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
      ownerId: spot.ownerId, 
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
      Owner: { 
        id: spot.User.id,
        firstName: spot.User.firstName,
        lastName: spot.User.lastName,
      },
    });
  });
  
// Create a spot
router.post('/', requireAuth, async (req, res, next) => {
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
        ownerId: req.user.id, 
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        avgRating: 1,
      });
  
      return res.status(201).json({
        id: spot.id,
        ownerId: spot.ownerId,
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

// Add an image to a spot based on the spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
  
    try {
      const spot = await Spot.findByPk(spotId);
  
      if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
      }
  
      if (spot.ownerId !== req.user.id) {
          const err = new Error("You are not authorized to add an image to this spot");
          err.status = 403;
          return next(err); 
        }
    
        const spotImage = await SpotImage.create({
          spotId: spot.id,
          url,
          preview
        });
    
        return res.status(201).json({
          id: spotImage.id,
          url: spotImage.url,
          preview: spotImage.preview
        });
    
      } catch (error) {
        console.error(error);
        next(error); 
      }
    });

// Edit a spot
router.put('/spotId', requireAuth, async(req, res, next) => {
    const { spotId } = req.params;
    const userId = req.user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
          return res.status(404).json({
            message: "Spot couldn't be found"
          });
        }
    
        if (spot.userId !== userId) {
          return res.status(403).json({ message: "Not authorized to edit this spot" });
        }
    
        const errors = {};
        if (!address) errors.address = "Street address is required";
        if (!city) errors.city = "City is required";
        if (!state) errors.state = "State is required";
        if (!country) errors.country = "Country is required";
        if (lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
        if (lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
        if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
        if (!description) errors.description = "Description is required";
        if (price <= 0) errors.price = "Price per day must be a positive number";
    
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({
            message: "Bad Request",
            errors
          });
        }
    
        await spot.update({
          address, city, state, country, lat, lng, name, description, price
        });
    
        res.status(200).json({
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
          updatedAt: spot.updatedAt
        });
    
      } catch (error) {
        next(error);
      }
    });

// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
  const userId = req.user.id; 

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }
    if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: "Not authorized to delete this spot"
      });
    }

    await spot.destroy();

    res.status(200).json({
      message: "Successfully deleted"
    });

  } catch (error) {
    next(error);
  }
});

// Create a Review for a Spot based on the Spot's ID
router.post("/:spotId/reviews", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  //404 error if spot not found
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const { review, stars } = req.body;
  const id = spot.id;
  const userId = req.user.id;

  //Error response: Review from the current user already exists for the Spot
  const revs = await Review.findOne({
    where: {
      spotId: id,
      userId,
    },
  });

  if (revs) {
    return res.status(500).json({
      message: "User already has a review for this spot",
    });
  }

  try {
    const createdReview = await Review.create({
      spotId: id,
      userId,
      review,
      stars,
    });
    await createdReview.save();
    return res.status(201).json(createdReview);
  } catch (e) {
    e.status = 400;
    next(e);
  }
});

//Get all Reviews by a Spot's Id
router.get('/:spotId/reviews', async (req, res, next) => {
  try {
      //Find all reviews based on spot id
      const Reviews = await Review.findAll({
          where: {
              spotId: parseInt(req.params.spotId)
          },
          include: [
              {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName']
              },
              {
                  model: ReviewImage,
                  attributes: ['id', 'url']
              }
          ]
      });
      //If none are found, create an error
      if (!Reviews || Reviews.length === 0)
          return res.status(404).json({
              message: "Spot couldn't be found"
          })

      res.json({ Reviews })
  } catch (error) {
      next(error)
  }
})

//Add Query Filters to Get All Spots	
router.get('/spotSearch', validateQueryValues, async (req, res, next) => {
  try {
      const { maxLat, minLat, maxLng, minLng, minPrice, maxPrice } = req.query;
      
      //Parse page and size values
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 20;

      const where = {};
      //Latitude Filter
      if (minLat)
          where.lat = { [Op.gte]: parseFloat(minLat) };
      if (maxLat)
          where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };

      //Longitude Filter
      if (minLng)
          where.lng = { [Op.gte]: parseFloat(minLng) };
      if (maxLng)
          where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };

      //Price Filter
      if (minPrice)
          where.price = { [Op.gte]: parseFloat(minPrice) };
      if (maxPrice)
          where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

      //Find all filtered spots
      const spots = await Spot.findAll({
          where,
          limit: size,
          offset: (page - 1) * size
      });

      //Loop through, and format all filtered spots, then add them to Spots array
      let Spots = [];

      for (const spot of spots) {
          spot.lat = parseFloat(spot.lat);
          spot.lng = parseFloat(spot.lng);
          spot.price = parseFloat(spot.price);
          const values = spot.toJSON();
          Spots.push(values);
      }

      const reviews = await Review.findAll();
      let average = {};

      for (const review of reviews) {
          let values = review.toJSON();
          //Create average for each spot if it doesnt already exist
          if (!average[values.spotId]) {
              average[values.spotId] = {
                  spotId: values.spotId,
                  currStars: values.stars,
                  amountReviews: 1
              }
          } // Add up the total stars and total number of reviews
          else {
              average[values.spotId].total = average[values.spotId].currStars + values.stars;
              average[values.spotId].amountReviews++;
          }
      }

      //Calculate average rating and store it in ratings object
      let ratings = {};

      for (const rating in average) {
          ratings[average[rating].spotId] = average[rating].total / average[rating].amountReviews
      }
      
      //Find all preview images, and store them in previews object
      const previewImages = await SpotImage.findAll({
          where: {
              preview: true
          }
      });

      let previews = {};

      for (const previewImage of previewImages) {
          let image = previewImage.toJSON();
          previews[image.spotId] = image.url;
      }
      // Add average rating and preview image to each spot
      for (const spot of Spots) {
          spot.avgRating = ratings[spot.id];
          spot.previewImage = previews[spot.id]
      }

      res.json({ Spots, page: +page, size: +size });
  }
  catch (error) {
      next(error)
  }
});

module.exports = router;
