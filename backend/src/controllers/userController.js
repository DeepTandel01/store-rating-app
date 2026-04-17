const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { User, Store, Rating } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [[sortField, sortOrder]],
      include: [{ model: Store, as: 'store', attributes: ['id', 'name'] }]
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Store, as: 'store', include: [{ model: Rating, as: 'ratings' }] }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const userData = user.toJSON();

    if (user.role === 'store_owner' && user.store) {
      const ratings = user.store.ratings || [];
      const avgRating = ratings.length
        ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
        : null;
      userData.store.averageRating = avgRating;
      userData.store.totalRatings = ratings.length;
    }

    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, address, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password, address, role });
    const { password: _, ...userData } = user.toJSON();

    res.status(201).json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count()
    ]);

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
