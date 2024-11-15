const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth'); 
const router = express.Router();

//Delete a Spot Image
router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        //Find spot image by its id
        const currentSpotImage = await SpotImage.findByPk(parseInt(req.params.id));

        //if spot image doesn't exist, throw an error
        if (!currentSpotImage) {
            return res.status(404).json({
                message: "Spot Image couldn't be found"
            })
        };
        //Find associated spot from spot image
        const spot = await Spot.findByPk(currentSpotImage.spotId);

        //check if userid of spot and current user are the same
        if (spot.ownerId !== req.user.id) {
            const err = new Error("Spot must belong to the current user");
            err.status = 403;
            err.title = "Forbidden";
            return next(err);
        }

        //Delete spot image
        await currentSpotImage.destroy();

        res.json({
            message: "Successfully deleted"
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;