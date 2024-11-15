const express = require("express");
const { Op, Sequelize } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { validateReview, validateQueryValues } = require("../../utils/validation");
const { Spot, SpotImage, User, Review, ReviewImage} = require("../../db/models");
const router = express.Router();

// Get all spots owned by the current user
router.get("/current", requireAuth, async (req, res) => {
  let Spots = await Spot.findAll({
    where: { ownerId: req.user.id },
  });
  if (!Spots) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }
  return res.status(200).json({ Spots });
});

// Get details of a spot from an id
router.get("/:spotId", async (req, res, next) => {
  const { spotId } = req.params;

  const spot = await Spot.findOne({
    where: { id: spotId },
    include: [
      {
        model: SpotImage,
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
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
    SpotImages: spot.SpotImages.map((image) => ({
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
router.post("/", requireAuth, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const errors = {};
  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (!lat || lat < -90 || lat > 90)
    errors.lat = "Latitude must be within -90 and 90";
  if (!lng || lng < -180 || lng > 180)
    errors.lng = "Longitude must be within -180 and 180";
  if (name === undefined || name.length > 50)
    errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (typeof price !== "number" || price <= 0)
    errors.price = "Price per day must be a positive number";

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
    next(error);
  }
});

// Add an image to a spot based on the spot's id
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
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
      const err = new Error(
        "You are not authorized to add an image to this spot"
      );
      err.status = 403;
      return next(err);
    }

    const spotImage = await SpotImage.create({
      spotId: spot.id,
      url,
      preview,
    });

    return res.status(201).json({
      id: spotImage.id,
      url: spotImage.url,
      preview: spotImage.preview,
    });
  } catch (error) {
    next(error);
  }
});

// Edit a spot
router.put("/:spotId", requireAuth, async (req, res) => {
  let spot = await Spot.findOne({
    where: {
      id: req.params.spotId,
    },
  });

  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const errors = {};
  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (!lat || lat < -90 || lat > 90)
    errors.lat = "Latitude must be within -90 and 90";
  if (!lng || lng < -180 || lng > 180)
    errors.lng = "Longitude must be within -180 and 180";
  if (!name || name.length > 50)
    errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (typeof price !== "number" || price <= 0)
    errors.price = "Price per day must be a positive number";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  } else if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Spot must belong to the current user",
      statusCode: 403,
    });
  }
  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save();

  const revisedSpot = await Spot.findOne({
    where: {
      address: address,
      city: city,
      state: state,
      country: country,
      lat: lat,
      lng: lng,
      name: name,
      description: description,
      price: price,
      ownerId: req.user.id,
    },
    attributes: { exclude: ["previewImage", "avgRating"] },
  });
  return res.status(200).json(revisedSpot);
});

// Delete a spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }
    if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: "Not authorized to delete this spot",
      });
    }

    await spot.destroy();

    res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    next(error);
  }
});

// Create a Review for a Spot based on the Spot's ID
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res) => {
    const { review, stars } = req.body;
    const { spotId } = req.params;
    let currentUser = req.user.id;
    const spot = await Spot.findByPk(spotId);
    const reviewed = await Review.findOne({
      where: {
        spotId: spotId,
        userId: currentUser,
      },
    });

    if (reviewed) {
      return res.status(500).json({
        message: "User already has a review for this spot",
        statusCode: 500,
      });
    } else if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404,
      });
    } else if (spot.ownerId === req.user.id) {
      return res.status(403).json({
        message: "Spot must not belong to the current user",
        statusCode: 403,
      });
    } else {
      let newReview = await Review.create({
        userId: req.user.id,
        spotId: parseInt(spotId),
        review,
        stars,
      });
      return res.status(201).json(newReview);
    }
  }
);

//Get all Reviews by a Spot's Id
router.get("/:spotId/reviews", async (req, res, next) => {
  try {
    //Find all reviews based on spot id
    const Reviews = await Review.findAll({
      where: {
        spotId: parseInt(req.params.spotId),
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });
    //If none are found, create an error
    if (!Reviews || Reviews.length === 0)
      return res.status(404).json({
        message: "Spot couldn't be found",
      });

    res.status(200).json({ Reviews });
  } catch (error) {
    next(error);
  }
});
//Add Query Filters to Get All Spots
router.get("/", validateQueryValues, async (req, res) => {
  let { page, size } = req.query;

  let where = {};

  let pagination = {};
  page = parseInt(page);
  size = parseInt(size);
  if (isNaN(page)) page = 1;
  if (isNaN(size)) size = 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;
  pagination.limit = size;
  pagination.offset = size * (page - 1);

  const allSpots = await Spot.findAll({
    where,
    include: [{ model: Review }, { model: SpotImage }],
    ...pagination,
  });

  const Spots = [];

  for (let i = 0; i < allSpots.length; i++) {
    let spot = allSpots[i];
    Spots.push(spot.toJSON());
  }

  for (let i = 0; i < Spots.length; i++) {
    let spot = Spots[i];

    if (spot.SpotImages.length > 0) {
      for (let j = 0; j < spot.SpotImages.length; j++) {
        const spotImage = spot.SpotImages[j];
        if (spotImage.preview) {
          spot.previewImage = spotImage.url;
        }
      }
    }
    delete spot.SpotImages;

    let reviewData = await Review.findOne({
      where: {
        spotId: spot.id,
      },
      attributes: [[Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"]],
    });

    spot.avgRating = reviewData.toJSON().avgRating;

    delete spot.Reviews;
  }
  console.log(Spots);
  return res.status(200).json({ Spots, page, size });
});

module.exports = router;
