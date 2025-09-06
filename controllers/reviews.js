const Listing = require("../models/listing.js")
const Review = require("../models/review.js");

module.exports.postReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newRew = new Review(req.body.review);
  newRew.author = req.user._id; 
  listing.reviews.push(newRew);

  await newRew.save();
  await listing.save();
  req.flash("success","New Review Created.");
  res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted.");
  res.redirect(`/listings/${id}`);
}