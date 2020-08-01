const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const tree_auth = require('../middleware/tree_auth');
const { check, validationResult } = require('express-validator');
const Relative = require('../models/Relative');
const Relationship = require('../models/Relationship');
const roles = require('../utils/roles');

// @route   GET api/trees/:treeId/relatives
// @desc    Get all relatives in a tree
// @access  Private

router.get('/', [auth, tree_auth], async (req, res) => {
  try {
    const relatives = await Relative.find({ tree: req.params.treeId });
    if (!relatives || res.role < roles.read)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });
    res.json({ data: relatives });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ errors: ['Server Error.'] });
  }
});

// @route   POST api/trees/:treeId/relatives
// @desc    Add new relative
// @access  Private
router.post(
  '/',
  [
    [auth, tree_auth],
    [
      check('first_name', 'First name is required').not().isEmpty(),
      check('last_name', 'Last name is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    if (res.role < roles.add)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      first_name,
      last_name,
      gender,
      birthdate,
      deathdate,
      attributes,
      children,
      parents,
    } = req.body;

    try {
      const newRelative = new Relative({
        tree: req.params.treeId,
        first_name,
        last_name,
        gender,
        birthdate,
        deathdate,
        attributes,
        children,
        parents,
      });
      const relative = await newRelative.save();
      res.json({ data: relative });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ errors: ['Server Error.'] });
    }
  }
);

// @route   GET api/trees/:treeId/relatives/:relativeId
// @desc    Get a relative
// @access  Private

router.get('/:relativeId', [auth, tree_auth], async (req, res) => {
  try {
    if (res.role < roles.read)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });
    let relative = await Relative.findOne({
      _id: req.params.relativeId,
      tree: req.params.treeId,
    });
    if (!relative)
      return res.status(404).json({ errors: ['Relative not found.'] });
    res.json({ data: relative });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ errors: ['Server Error.'] });
  }
});

// @route   PUT api/trees/:treeId/relatives/:relativeId
// @desc    Update relative
// @access  Private
router.put('/:relativeId', [auth, tree_auth], async (req, res) => {
  if (res.role < roles.edit)
    return res
      .status(500)
      .json({ errors: ['Tree not found, or permission denied.'] });

  const fields = [
    'first_name',
    'last_name',
    'gender',
    'birthdate',
    'deathdate',
    'attributes',
    'notes',
  ];
  const populatedFields = {};
  for (const field of fields)
    if (req.body[field]) populatedFields[field] = req.body[field];
  try {
    let relative = await Relative.exists({
      _id: req.params.relativeId,
      tree: req.params.treeId,
    });
    if (!relative)
      return res.status(404).json({ errors: ['Relative not found.'] });

    relative = await Relative.findByIdAndUpdate(
      req.params.relativeId,
      {
        $set: populatedFields,
      },
      { new: true }
    );
    res.json({ data: relative });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ errors: ['Server Error.'] });
  }
});

// @route   api/trees/:treeId/relatives/:relativeId
// @desc    Delete a relative
// @access  Private
router.delete('/:relativeId', [auth, tree_auth], async (req, res) => {
  if (res.role < roles.delete)
    return res
      .status(500)
      .json({ errors: ['Tree not found, or permission denied.'] });

  try {
    let relative = await Relative.findOne({
      _id: req.params.relativeId,
      tree: req.params.treeId,
    });
    if (!relative) return res.status(404).json({ msg: 'Relative not found.' });
    for (const childId of relative.children) {
      const child = await Relative.findOne(
        {
          _id: childId,
          tree: req.params.treeId,
        },
        'parents'
      );
      if (child)
        await Relative.findByIdAndUpdate(childId, {
          parents: child.parents.filter((x) => x !== req.params.relativeId),
        });
    }
    for (const parentId of relative.parents) {
      const parent = await Relative.findOne(
        {
          _id: parentId,
          tree: req.params.treeId,
        },
        'children'
      );
      if (parent)
        await Relative.findByIdAndUpdate(parentId, {
          children: parent.children.filter((x) => x !== req.params.relativeId),
        });
    }
    relative = await Relative.findByIdAndRemove(req.params.relativeId);
    res.send('Relative deleted.');
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ errors: ['Server Error.'] });
  }
});

// @route   GET api/trees/:treeId/relatives/:relativeId/children
// @desc    Get a relative's children
// @access  Private
router.get('/:relativeId/children', [auth, tree_auth], async (req, res) => {
  try {
    if (res.role < roles.read)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });
    let relative = await Relative.findOne(
      {
        _id: req.params.relativeId,
        tree: req.params.treeId,
      },
      'children'
    ).populate('children');
    if (!relative)
      return res.status(404).json({ errors: ['Relative not found.'] });
    res.json({ data: relative.children });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ errors: ['Server Error.'] });
  }
});

// @route   POST api/trees/:treeId/relatives/:relativeId/children
// @desc    Add new child to relative
// @access  Private
router.post(
  '/:relativeId/children/:childId',
  [[auth, tree_auth]],
  async (req, res) => {
    if (res.role < roles.add)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });

    try {
      const child = await Relative.exists({
        _id: req.params.childId,
        tree: req.params.treeId,
      });
      if (!child) return res.status(404).json({ errors: ['Child not found.'] });

      const relative = await Relative.findOneAndUpdate(
        { _id: req.params.relativeId, tree: req.params.treeId },
        { $addToSet: { children: req.params.childId } }
      );
      if (!relative)
        return res.status(404).json({ errors: ['Relative not found.'] });
      await Relative.findByIdAndUpdate(req.params.childId, {
        $addToSet: { parents: req.params.relativeId },
      });
      res.json({ msg: 'Child added.' });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ errors: ['Server Error.'] });
    }
  }
);

// @route   DELETE api/trees/:treeId/relatives/:relativeId/children/:childId
// @desc    Remove a child connection from a relative
// @access  Private
router.delete(
  '/:relativeId/children/:childId',
  [auth, tree_auth],
  async (req, res) => {
    if (res.role < roles.delete)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });

    try {
      let relative = await Relative.findOne(
        {
          _id: req.params.relativeId,
          tree: req.params.treeId,
        },
        'children'
      );
      if (!relative)
        return res.status(404).json({ errors: ['Relative not found.'] });
      if (!relative.children.some((x) => x.toString() === req.params.childId))
        return res
          .status(404)
          .json({ errors: ['Relative is not a parent of that child.'] });
      await Relative.findByIdAndUpdate(req.params.relativeId, {
        children: relative.children.filter(
          (x) => x.toString() !== req.params.childId
        ),
      });

      let child = await Relative.findOne(
        {
          _id: req.params.childId,
          tree: req.params.treeId,
        },
        'parents'
      );
      await Relative.findByIdAndUpdate(req.params.childId, {
        parents: child.parents.filter(
          (x) => x.toString() !== req.params.relativeId
        ),
      });

      res.json({ msg: 'Child removed.' });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ errors: ['Server Error.'] });
    }
  }
);

// @route   GET api/trees/:treeId/relatives/:relativeId/parents
// @desc    Get a relative's parents
// @access  Private
router.get('/:relativeId/parents', [auth, tree_auth], async (req, res) => {
  try {
    if (res.role < roles.read)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });
    let relative = await Relative.findOne(
      {
        _id: req.params.relativeId,
        tree: req.params.treeId,
      },
      'parents'
    ).populate('parents');
    if (!relative)
      return res.status(404).json({ errors: ['Relative not found.'] });
    res.json({ data: relative.parents });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ errors: ['Server Error.'] });
  }
});

// @route   GET api/trees/:treeId/relatives/:relativeId/relationships
// @desc    Get a relative's relationships
// @access  Private
router.get(
  '/:relativeId/relationships',
  [auth, tree_auth],
  async (req, res) => {
    try {
      if (res.role < roles.read)
        return res
          .status(500)
          .json({ errors: ['Tree not found, or permission denied.'] });
      let relative = await Relative.findOne(
        {
          _id: req.params.relativeId,
          tree: req.params.treeId,
        },
        'relationships'
      ).populate('relationships.spouse');
      if (!relative)
        return res.status(404).json({ errors: ['Relative not found.'] });
      return res.json(relative);
      // Todo: UNFINISHED
      const relationships = relative.relationships.map(async (relationship) => {
        const spouseId = await relationship.spouses.find(
          (x) => x.toString() !== req.params.relativeId
        );
        const spouse = Relative.findOne({
          _id: spouseId,
          tree: req.params.treeId,
        });
        const { _id, start_date, end_date } = relationship;
        return {
          _id,
          spouse,
          start_date: start_date || null,
          end_date: end_date || null,
        };
      });
      res.json({ data: relative.relationships });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ errors: ['Server Error.'] });
    }
  }
);

// @route   POST api/trees/:treeId/relatives/:relativeId/relationships
// @desc    Add new relationship to relative
// @access  Private
router.post(
  '/:relativeId/relationships',
  [[auth, tree_auth]],
  [check('spouseId', 'Spouse Id is required').not().isEmpty()],
  async (req, res) => {
    if (res.role < roles.add)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });

    try {
      if (req.params.relativeId === req.body.spouseId)
        return res.status(500).json({
          errors: ['Relative cannot be in a relationship with themself.'],
        });
      if (
        req.body.start_date &&
        req.body.end_date &&
        Date(req.body.start_date) > Date(req.body.end_date)
      )
        return res
          .status(500)
          .json({ errors: ['Start date cannot be after end date.'] });

      let relative = await Relative.exists({
        _id: req.params.relativeId,
        tree: req.params.treeId,
      });
      if (!relative)
        return res.status(404).json({ errors: ['Relative not found.'] });

      let spouse = await Relative.exists({
        _id: req.body.spouseId,
        tree: req.params.treeId,
      });
      if (!spouse)
        return res.status(404).json({ errors: ['Spouse not found.'] });

      const relationshipId = mongoose.Types.ObjectId();
      await Relative.findByIdAndUpdate(req.params.relativeId, {
        $addToSet: {
          relationships: {
            _id: relationshipId,
            spouse: req.body.spouseId,
            start_date: req.body.start_date || null,
            end_date: req.body.end_date || null,
          },
        },
      });
      await Relative.findByIdAndUpdate(req.body.spouseId, {
        $addToSet: {
          relationships: {
            _id: relationshipId,
            spouse: req.params.relativeId,
            start_date: req.body.start_date || null,
            end_date: req.body.end_date || null,
          },
        },
      });
      res.json({ data: relationshipId });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ errors: ['Server Error.'] });
    }
  }
);

// @route   PUT api/trees/:treeId/relatives/:relativeId/relationships/:relationshipId
// @desc    Add new spouse to relative
// @access  Private
router.put(
  '/:relativeId/relationships/:relationshipId',
  [[auth, tree_auth]],
  async (req, res) => {
    if (res.role < roles.add)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });

    try {
      // Todo: only get only the relevant relationship value
      let relative = await Relative.findOne(
        {
          _id: req.params.relativeId,
          tree: req.params.treeId,
        },
        'relationships'
      );
      if (!relative)
        return res.status(404).json({ errors: ['Relative not found.'] });
      const relationship = relative.relationships.find(
        (x) => x._id.toString() === req.params.relationshipId
      );
      if (!relationship)
        return res.status(404).json({ errors: ['Relationship not found.'] });
      if (req.body.start_date) relationship.start_date = req.body.start_date;
      if (req.body.end_date) relationship.end_date = req.body.end_date;
      if (Date(relationship.end_date) < Date(relationship.start_date))
        return res
          .status(500)
          .json({ errors: ['Start date cannot be after end date.'] });

      let spouse = await Relative.findOne(
        {
          _id: relationship.spouse,
          tree: req.params.treeId,
        },
        'relationships'
      );
      if (!spouse)
        return res.status(404).json({ errors: ['Spouse not found.'] });
      await Relative.findByIdAndUpdate(req.params.relativeId, {
        relationships: [
          ...relative.relationships.filter(
            (x) => x._id.toString() !== req.params.relationshipId
          ),
          relationship,
        ],
      });
      await Relative.findByIdAndUpdate(req.params.spouseId, {
        relationships: [
          ...spouse.relationships.filter(
            (x) => x._id.toString() !== req.params.relationshipId
          ),
          relationship,
        ],
      });
      res.json({ msg: 'Relationship updated.' });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ errors: ['Server Error.'] });
    }
  }
);

// @route   api/trees/:treeId/relatives/:relativeId
// @desc    Delete a relationship
// @access  Private
router.delete(
  '/:relativeId/spouses/:spouseId',
  [auth, tree_auth],
  async (req, res) => {
    if (res.role < roles.delete)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });

    try {
      let relative = await Relative.findOne(
        {
          _id: req.params.relativeId,
          tree: req.params.treeId,
        },
        'spouses'
      );
      if (!relative)
        return res.status(404).json({ errors: ['Relative not found.'] });
      if (!relative.children.some((x) => x.toString() === req.params.childId))
        return res
          .status(404)
          .json({ errors: ['Relative is not a parent of that child.'] });
      await Relative.findByIdAndUpdate(req.params.relativeId, {
        children: relative.children.filter(
          (x) => x.toString() !== req.params.childId
        ),
      });

      let child = await Relative.findOne(
        {
          _id: req.params.childId,
          tree: req.params.treeId,
        },
        'parents'
      );
      await Relative.findByIdAndUpdate(req.params.childId, {
        parents: child.parents.filter(
          (x) => x.toString() !== req.params.relativeId
        ),
      });

      res.json({ msg: 'Child removed.' });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ errors: ['Server Error.'] });
    }
  }
);

module.exports = router;
