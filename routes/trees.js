const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tree_auth = require('../middleware/tree_auth');
const Tree = require('../models/Tree');
const User = require('../models/User');
const roles = require('../utils/roles');
const Relative = require('../models/Relative');
const { check, validationResult } = require('express-validator');

// @route   GET api/trees
// @desc    Get all of a user's trees
// @access  Private

router.get('/', auth, async (req, res) => {
  try {
    const trees = await Tree.find({ 'users.user': req.user.id }).sort({
      date: -1,
    });
    res.json({ data: trees });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error.');
  }
});

// @route   POST api/trees
// @desc    Add new tree
// @access  Private
router.post(
  '/',
  auth,
  check('name', 'Name is required').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const newTree = new Tree({
        name: req.body.name,
        users: [{ user: req.user.id, role: roles.admin }],
      });
      const tree = await newTree.save();
      res.json({ data: tree });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/trees
// @desc    Update tree
// @access  Private
router.put(
  '/',
  [auth, tree_auth],
  check('name', 'Name is required').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    if (res.role < roles.edit)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });
    if (name.trim().length === 0)
      return res.status(400).json({ errors: ['Name cannot be empty.'] });

    try {
      let tree = await Tree.exists({ _id: req.params.treeId });
      if (!tree) return res.status(404).json({ errors: ['Tree not found.'] });

      tree = await Tree.findByIdAndUpdate(
        req.params.treeId,
        { $set: { name: req.body.name } },
        { new: true }
      );
      res.json({ data: tree });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/trees/:treeId
// @desc    Get a tree
// @access  Private
router.get('/:treeId', [auth, tree_auth], async (req, res) => {
  if (res.role < roles.read)
    return res
      .status(500)
      .json({ errors: ['Tree not found, or permission denied.'] });
  try {
    const tree = await Tree.find({ _id: req.params.treeId });
    res.json({ data: tree });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error.');
  }
});

// @route   DELETE api/trees
// @desc    Delete a tree
// @access  Private
router.delete('/:treeId', [auth, tree_auth], async (req, res) => {
  try {
    let tree = await Tree.findById(req.params.treeId);
    if (res.role < roles.admin)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });

    const relatives = await Relative.find({ tree: req.params.treeId }, '_id');
    if (relatives)
      for (const relative of relatives) {
        await Relative.findByIdAndRemove(relative._id);
      }
    await Tree.findByIdAndRemove(req.params.treeId);
    res.send({ data: { msg: 'Tree deleted.' } });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/trees/:treeId/users
// @desc    Get a tree's users
// @access  Private
router.get('/:treeId/users', [auth, tree_auth], async (req, res) => {
  if (res.role < roles.read)
    return res
      .status(500)
      .json({ errors: ['Tree not found, or permission denied.'] });
  try {
    const tree = await Tree.findById(req.params.treeId, 'users').populate({
      path: 'users.user',
      model: 'users',
      select: 'name',
    });
    res.json({ data: tree.users });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error.');
  }
});

// @route   POST api/trees/users/:userId
// @desc    Add user to tree
// @access  Private
router.post(
  '/:treeId/users/:userId',
  [auth, tree_auth],
  check('role', 'Role is required').not().isEmpty(),
  async (req, res) => {
    if (res.role < roles.admin)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const role = req.body.role;
    if (!Number.isInteger(role) || role < -1 || role > roles.admin)
      return res.status(400).json({
        errors: [
          'Role must be an integer between -1 and ' + roles.admin.toString(),
        ],
      });
    if (role > res.role)
      return res.status(400).json({
        errors: ['You cannot add a user with a role higher than your own.'],
      });

    try {
      let userExists = await User.exists({ _id: req.params.userId });
      if (!userExists)
        return res.status(404).json({ errors: ['User not found.'] });

      let tree = await Tree.findById(req.params.treeId, 'users');
      // treeAuth should have verified the tree exists
      if (tree.users.some((x) => x.user.toString() === req.params.userId))
        return res
          .status(400)
          .json({ errors: ['User already is attached to that tree.'] });

      tree = await Tree.findByIdAndUpdate(
        req.params.treeId,
        { $addToSet: { users: { user: req.params.userId, role } } },
        { new: true, select: 'users' }
      );
      res.json({ data: tree.users });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/trees/users/:userId
// @desc    Add user to tree
// @access  Private
router.put(
  '/:treeId/users/:userId',
  [auth, tree_auth],
  check('role', 'Role is required').not().isEmpty(),
  async (req, res) => {
    if (res.role < roles.admin)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const role = req.body.role;
    if (!Number.isInteger(role) || role < -1 || role > roles.admin)
      return res.status(400).json({
        errors: [
          'Role must be an integer between -1 and ' + roles.admin.toString(),
        ],
      });
    if (role > res.role)
      return res.status(400).json({
        errors: ["You cannot make a user's role higher than your own."],
      });

    try {
      let tree = await Tree.findById(req.params.treeId, 'users');
      // treeAuth should have verified the tree exists
      const user = tree.users.find(
        (x) => x.user.toString() === req.params.userId
      );
      if (!user)
        return res
          .status(400)
          .json({ errors: ['User is not a member of that tree.'] });
      if (user.role > res.role)
        return res.status(400).json({
          errors: [
            'Cannot change the role of a user with a higher role than your own.',
          ],
        });
      if (
        user.role === roles.admin &&
        res.role < roles.admin &&
        tree.users.filter((x) => x.role === roles.admin).length === 1
      )
        return res.status(400).json({
          errors: ['Could not remove the only admin for this tree.'],
        });

      tree = await Tree.findByIdAndUpdate(
        req.params.treeId,
        {
          users: tree.users.map((x) => {
            return {
              user: x.user,
              role:
                x.user.toString() === req.params.userId
                  ? req.body.role
                  : x.role,
            };
          }),
        },
        { new: true, select: 'users' }
      );
      res.json({ data: tree.users });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/trees/users/:userId
// @desc    Remove user from tree
// @access  Private
router.delete('/:treeId/users/:userId', [auth, tree_auth], async (req, res) => {
  if (res.role < roles.delete)
    return res
      .status(500)
      .json({ errors: ['Tree not found, or permission denied.'] });

  try {
    let tree = await Tree.findById(req.params.treeId, 'users');
    // treeAuth should have verified the tree exists
    const user = tree.users.find(
      (x) => x.user.toString() === req.params.userId
    );
    if (!user)
      return res
        .status(400)
        .json({ errors: ['User is not a member of that tree.'] });
    if (user.role > res.role)
      return res.status(400).json({
        errors: ['Cannot remove a user with a higher role than your own.'],
      });
    if (
      user.role === roles.admin &&
      tree.users.filter((x) => x.role === roles.admin).length === 1
    )
      return res.status(400).json({
        errors: ['Could not remove the only admin for this tree.'],
      });

    tree = await Tree.findByIdAndUpdate(
      req.params.treeId,
      {
        users: tree.users.filter(
          (x) => x.user.toString() !== req.params.userId
        ),
      },
      { new: true, select: 'users' }
    );
    res.json({ data: tree.users });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
