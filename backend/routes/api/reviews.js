const router = require("express").Router();
const { SpotImage, Spot, User, Review, ReviewImage} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { validateReview } = require("../../utils/validation");

const imageMax = async (req, res, next) => {
  const { reviewId } = req.params;

  const imageCount = await ReviewImage.count({
    where: { reviewId },
  });

  if (imageCount >= 10) {
    const err = new Error(
      `Maximum number of images for this resource was reached`
    );
    err.status = 403;
    return next(err);
  } else {
    next();
  }
};

// Get Reviews of Current User
router.get("/current", requireAuth, async (req, res) => {
  const Reviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: [
            "username",
            "email",
            "hashedPassword",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      {
        model: Spot,
        attributes: {
          exclude: ["description", "avgRating", "createdAt", "updatedAt"],
        },
      },
      {
        model: ReviewImage,
        attributes: {
          exclude: ["reviewId", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  if (!Reviews) {
    return res.status(404).json({
      message: "Reviews couldn't be found",
      statusCode: 404,
    });
  } else {
    return res.status(200).json({ Reviews });
  }
});

// Add an Image to a Review based on the Review's ID
router.post("/:reviewId/images", requireAuth, imageMax, async (req, res, next) => {

    const { url } = req.body;
    const { reviewId } = req.params;
    const { user } = req;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      const err = new Error(`Review couldn't be found`);
      err.status = 404;
      return next(err);
    }

    if (review && parseInt(review.userId) !== parseInt(user.id)) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }
    const image = await ReviewImage.create({
      reviewId,
      url,
    });
    return res.status(201).json({ id: image.id, url: image.url });
  }
);

// Edit a Review
router.put("/:reviewId", validateReview, requireAuth, async (req, res, next) => {
    const { review, stars } = req.body;
    const { reviewId } = req.params;
    const { user } = req;

    const oldReview = await Review.findByPk(reviewId);
    if (oldReview && parseInt(oldReview.userId) !== parseInt(user.id)) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }
    if (oldReview) {
      await oldReview.update({
        review,
        stars,
      });

      return res.json(oldReview);
    } else {
      const err = new Error(`Review couldn't be found`);
      err.status = 404;
      return next(err);
    }
  }
);

// Delete a Review
router.delete('/:reviewId',requireAuth, async(req,res) => {
    const {reviewId} = req.params;
    const review = await Review.findOne({
        where:{
            id:reviewId,
        }
    });
    if(!review){
        res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        });
    }else if(review.userId !== req.user.id){
        return res.status(403).json({
            message: "Review must belong to the current user",
            statusCode: 403
        });
    }else{
        await review.destroy()
        res.status(200).json({
            message: "Successfully deleted",
            statusCode: 200
        });
    }
});

module.exports = router;
