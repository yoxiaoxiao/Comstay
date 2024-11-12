const router = require('express').Router();
const { SpotImage, Spot, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateReviews, reviewCreationValidation } = require('../../utils/validation')

//Get all Reviews of the Current User
router.get('/users/:userId/reviews', requireAuth, async (req, res, next) => {
    try {
        //Find all reviews based on user id
        const reviews = await Review.findAll({
            where: {
                userId: req.user.id
            },
        });

        let Reviews = [];

        for (const review of reviews) {
            //Gather all related info and organize it
            const user = await User.findByPk(req.user.id);
            const spot = await Spot.findByPk(review.spotId);
            const reviewImages = await ReviewImage.findAll({
                where: {
                    reviewId: review.id
                }
            });

            let imgs = reviewImages.map(reviewImage => ({
                id: reviewImage.id,
                url: reviewImage.url
            }));

            const previewImage = await SpotImage.findOne({
                where: {
                    spotId: review.spotId,
                    preview: true
                }
            });

            // Check if current spot has a preview image
            if (previewImage) previewImage = previewImage.url
            else previewImage = null
            
            // Add current review to Reviews array and loop again
            Reviews.push({
                ...review.toJSON(),
                User: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                Spot: {
                    id: spot.id,
                    ownerId: spot.userId,
                    address: spot.address,
                    city: spot.city,
                    state: spot.state,
                    country: spot.country,
                    lat: spot.lat,
                    lng: spot.lng,
                    name: spot.name,
                    price: spot.price,
                    previewImage: previewImage
                },
                ReviewImages: imgs
            });
        }

        res.json({ Reviews });
    } catch (error) {
        next(error);
    }
});

//Get all Reviews by a Spot's Id
router.get('/spots/:spotId/reviews', async (req, res, next) => {
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

//Create a Review for a Spot based on the Spot's id
router.post('/spots/:spotId/reviews', requireAuth, validateReviews, async (req, res, next) => {
    try {
        //Find spot by id and create an error if not found
        const spot = await Spot.findByPk(parseInt(req.params.spotId));

        if (!spot) return res.status(404).json(
            {
                message: "Spot couldn't be found"
            });

        //Find any review that already has been created for this spot
        const spotReviews = await Review.findAll({
            where: {
                spotId: req.params.spotId
            }
        })

        for (const review of spotReviews) {
            if (review.userId === req.user.id)
                return res.status(500).json({
                    message: "User already has a review for this spot"
                })
        }
        //Create review for spot
        const { review, stars } = req.body;

        const createdReview = await Review.create({
            userId: req.user.id,
            spotId: parseInt(req.params.spotId),
            review: review,
            stars: stars
        })

        res.status(201).json(createdReview);

    } catch (error) {
        next(error)
    }
});

//Add an image to a Review based on the Review's id
router.post('/reviews/:reviewid/images', requireAuth, reviewCreationValidation, async (req, res, next) => {
    try {
        //Find review by id and error if none are found
        const review = await Review.findByPk(parseInt(req.params.reviewId));

        if (!review)
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        //Check if there are more than 10 images in the review
        const reviewCount = await ReviewImage.count({
            where: {
                reviewId: parseInt(req.params.reviewId)
            }
        });

        if (reviewCount >= 10)
            return res.status(403).json({
                message: "Maximum number of images for this resource was reached"
            });
        //Add the image to the review
        const { url } = req.body;
        const newReviewImage = await ReviewImage.create({
            url: url,
            reviewId: parseInt(req.params.reviewId)
        });

        const safeReviewImage = {
            id: newReviewImage.id,
            url: newReviewImage.url
        }

        res.status(201).json(safeReviewImage);

    } catch (error) {
        next(error)
    }

});

//Edit a Review
router.put('/reviews/:reviewid', requireAuth, reviewCreationValidation, validateReviews, async (req, res, next) => {
    try {
        //Find review based on review id
        const newReview = await Review.findByPk(parseInt(req.params.reviewId));
        //Update review with new info
        const { review, stars } = req.body
        await newReview.update({
            review: review,
            stars: stars
        })

        res.json(newReview)
    } catch (error) {
        next(error)
    }
});

//Delete a Review
router.delete('/reviews/:reviewid', requireAuth, reviewCreationValidation, async (req, res, next) => {
    try {
        //Find review based on review id
        const review = await Review.findByPk(parseInt(req.params.reviewId))

        //If review does not exist, throw an error
        if (!review)
            return res.status(404).json({
                message: "Review couldn't be found"
            });

        //Delete review
        await review.destroy();

        res.json({
            message: "Successfully deleted"
        })
    } catch (error) {
        next(error)
    }
});





module.exports = router;