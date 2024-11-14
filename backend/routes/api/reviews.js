const router = require('express').Router();
const { SpotImage, Spot, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateReview } = require('../../utils/validation')

const imageMax = async (req, res, next) => {
    const { reviewId } = req.params;

    const imageCount = await ReviewImage.count({
        where: { reviewId }
    })

    if(imageCount >= 10) {
        const err = new Error(`Maximum number of images for this resource was reached`);
        err.status = 403;
        return next(err);
    } else {
        next();
    }
}

// Add an Image to a Review based on the Review's ID
router.post('/:reviewId/images', requireAuth, imageMax, async(req, res, next) => {
    const { url } = req.body;
    const { reviewId } = req.params;
    const { user } = req;

    const review = await Review.findByPk(reviewId);

    if(!review) {
        const err = new Error(`Review couldn't be found`);
        err.status = 404;
        return next(err);
    }

    if (review && parseInt(review.userId) !== parseInt(user.id)) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }
    const image = await ReviewImage.create({
        reviewId,
        url,
    })
    return res.json({ id: image.id, url: image.url });
})

// Edit a Review
router.put('/:reviewId', validateReview, requireAuth, async(req, res, next) => {
    const { review, stars } = req.body;
    const { reviewId } = req.params;
    const { user } = req;

    const oldReview = await Review.findByPk(reviewId);
    if (oldReview && parseInt(oldReview.userId) !== parseInt(user.id)) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }
    if(oldReview) {
        await oldReview.update({
            review,
            stars
        });

        return res.json(oldReview);
    } else {
        const err = new Error(`Review couldn't be found`);
        err.status = 404;
        return next(err);
    }
})

// Delete a Review
router.delete('/:reviewId', requireAuth, async(req, res, next) => {
    const { reviewId } = req.params;
    const { user } = req;

    const review = await Review.findByPk(reviewId);
    if(review && parseInt(review.userId) !== parseInt(user.id)) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }
    if(review) {
        await review.destroy();
        return res.json({ message: 'Successfully deleted', statusCode: 200 });
    } else {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }
});

module.exports = router;