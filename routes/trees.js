const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tree_auth = require('../middleware/tree_auth');
const Tree = require('../models/Tree');
const roles = require('../utils/roles');
const Relative = require('../models/Relative');

// @route   GET api/trees
// @desc    Get all of a user's trees
// @access  Private

router.get('/', auth, async (req, res) => {
  try {
    const trees = await Tree.find({ 'members.user': req.user.id }).sort({
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
router.post('/', auth, async (req, res) => {
  try {
    const newTree = new Tree({
      members: [{ user: req.user.id, role: roles.delete }],
    });
    const tree = await newTree.save();
    res.json({ data: tree });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/trees
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
    if (res.role < roles.read)
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

module.exports = router;
