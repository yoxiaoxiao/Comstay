const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth'); 
const router = express.Router();

// Add an image to a spot based on the spot's id
router.post('/spots/:spotId/images', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      const err = new Error("Spot not found");
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

module.exports = router;