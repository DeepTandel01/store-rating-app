const { validationResult } = require('express-validator');
const { Rating, Store } = require('../models');

exports.submitRating = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [ratingRecord, created] = await Rating.findOrCreate({
      where: { userId, storeId },
      defaults: { rating }
    });

    if (!created) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    }

    res.status(created ? 201 : 200).json({
      message: created ? 'Rating submitted' : 'Rating updated',
      rating: ratingRecord
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
