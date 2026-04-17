const { Op, fn, col, literal } = require('sequelize');
const { validationResult } = require('express-validator');
const { Store, Rating, User } = require('../models');

exports.getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const validSortFields = ['name', 'email', 'address', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating', 'userId'] }],
      order: [[sortField, sortOrder]]
    });

    const userId = req.user?.id;

    const storesWithRatings = stores.map(store => {
      const s = store.toJSON();
      const ratings = s.ratings || [];
      s.averageRating = ratings.length
        ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1))
        : null;
      s.totalRatings = ratings.length;
      if (userId) {
        const myRating = ratings.find(r => r.userId === userId);
        s.userRating = myRating ? myRating.rating : null;
      }
      delete s.ratings;
      return s;
    });

    res.json(storesWithRatings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, address, ownerId } = req.body;

    const existing = await Store.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Store email already in use' });

    const store = await Store.create({ name, email, address, ownerId });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStoreOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { ownerId: req.user.id },
      include: [{
        model: Rating,
        as: 'ratings',
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
      }]
    });

    if (!store) return res.status(404).json({ message: 'No store found for this owner' });

    const s = store.toJSON();
    const ratings = s.ratings || [];
    s.averageRating = ratings.length
      ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1))
      : null;
    s.totalRatings = ratings.length;

    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
