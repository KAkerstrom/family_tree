const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const tree_auth = require('../middleware/tree_auth');
const { check, validationResult } = require('express-validator');
const querystring = require('querystring');
const Tree = require('../models/Tree');
const Relative = require('../models/Relative');
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
    'children',
    'parents',
  ];
  const populatedFields = {};
  for (field in fields)
    if (req.body[field]) populatedFields[field] = req.body[field];

  try {
    let relative = await Relative.findOne({
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
    res.json(relative);
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

// @route   GET api/trees/:treeId/relatives/:relativeId/spouses
// @desc    Get a relative's spouses
// @access  Private
router.get('/:relativeId/spouses', [auth, tree_auth], async (req, res) => {
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
      'spouses'
    ).populate('spouses.spouse');
    if (!relative)
      return res.status(404).json({ errors: ['Relative not found.'] });
    res.json({ data: relative.spouses });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ errors: ['Server Error.'] });
  }
});

// @route   POST api/trees/:treeId/relatives/:relativeId/spouses
// @desc    Add new spouse to relative
// @access  Private
router.post(
  '/:relativeId/spouses/:spouseId',
  [[auth, tree_auth]],
  async (req, res) => {
    if (res.role < roles.add)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });

    try {
      if (
        req.body.start_date &&
        req.body.end_date &&
        req.body.start_date > req.body.end_date
      )
        return res
          .status(500)
          .json({ errors: ['Start date cannot be after end date.'] });
      let relative = await Relative.findOne(
        {
          _id: req.params.relativeId,
          tree: req.params.treeId,
        },
        'spouses'
      );
      if (!relative)
        return res.status(404).json({ errors: ['Relative not found.'] });
      if (
        relative.spouses.filter(
          (x) => x.spouse.toString() === req.params.spouseId
        ).length > 0 &&
        (!req.body.start_date || !req.body.end_date)
      )
        res.status(500).json({
          errors: [
            'If adding multiple relationships between 2 people, you must specify all start and end dates.',
          ],
        });
      for (const relationship in relative.spouses) {
        if (
          relationship.spouse.toString() === req.params.spouseId &&
          (!relationship.start_date || !relationship.end_date)
        )
          res.status(500).json({
            errors: [
              'If adding multiple relationships between 2 people, you must specify all start and end dates.',
            ],
          });
        if (
          !(
            req.body.end_date < relationship.start_date ||
            req.body.start_date > relationship.end_date
          )
        )
          res.status(500).json({
            errors: ['Relationship dates cannot overlap.'],
          });
      }

      let spouse = await Relative.findOne(
        {
          _id: req.params.childId,
          tree: req.params.treeId,
        },
        'spouses'
      );
      if (!spouse)
        return res.status(404).json({ errors: ['Spouse not found.'] });
      // Shouldn't need to check for start/end dates on spouse
      for (const relationship in spouse.spouses)
        if (
          !(
            req.body.end_date < relationship.start_date ||
            req.body.start_date > relationship.end_date
          )
        )
          res.status(500).json({
            errors: ["Spouse's relationship dates cannot overlap."],
          });

      await Relative.findByIdAndUpdate(req.params.spouseId, {
        $addToSet: {
          spouses: {
            spouse: req.params.relativeId,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
          },
        },
      });
      await Relative.findByIdAndUpdate(req.params.relativeId, {
        $addToSet: {
          spouses: {
            spouse: req.params.spouseId,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
          },
        },
      });
      res.json({ msg: 'Spouse added.' });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ errors: ['Server Error.'] });
    }
  }
);

// @route   PUT api/trees/:treeId/relatives/:relativeId/spouses
// @desc    Add new spouse to relative
// @access  Private
router.post(
  '/:relativeId/spouses/:spouseId',
  [[auth, tree_auth]],
  async (req, res) => {
    if (res.role < roles.add)
      return res
        .status(500)
        .json({ errors: ['Tree not found, or permission denied.'] });

    try {
      if (
        req.body.start_date &&
        req.body.end_date &&
        req.body.start_date > req.body.end_date
      )
        return res
          .status(500)
          .json({ errors: ['Start date cannot be after end date.'] });
      let relative = await Relative.findOne(
        {
          _id: req.params.relativeId,
          tree: req.params.treeId,
        },
        'spouses'
      );
      if (!relative)
        return res.status(404).json({ errors: ['Relative not found.'] });
      if (
        relative.spouses.filter(
          (x) => x.spouse.toString() === req.params.spouseId
        ).length > 0 &&
        (!req.body.start_date || !req.body.end_date)
      )
        res.status(500).json({
          errors: [
            'If adding multiple relationships between 2 people, you must specify all start and end dates.',
          ],
        });
      for (const relationship in relative.spouses) {
        if (
          relationship.spouse.toString() === req.params.spouseId &&
          (!relationship.start_date || !relationship.end_date)
        )
          res.status(500).json({
            errors: [
              'If adding multiple relationships between 2 people, you must specify all start and end dates.',
            ],
          });
        if (
          !(
            req.body.end_date < relationship.start_date ||
            req.body.start_date > relationship.end_date
          )
        )
          res.status(500).json({
            errors: ['Relationship dates cannot overlap.'],
          });
      }

      let spouse = await Relative.findOne(
        {
          _id: req.params.childId,
          tree: req.params.treeId,
        },
        'spouses'
      );
      if (!spouse)
        return res.status(404).json({ errors: ['Spouse not found.'] });
      // Shouldn't need to check for start/end dates on spouse
      for (const relationship in spouse.spouses)
        if (
          !(
            req.body.end_date < relationship.start_date ||
            req.body.start_date > relationship.end_date
          )
        )
          res.status(500).json({
            errors: ["Spouse's relationship dates cannot overlap."],
          });

      await Relative.findByIdAndUpdate(req.params.spouseId, {
        $addToSet: {
          spouses: {
            spouse: req.params.relativeId,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
          },
        },
      });
      await Relative.findByIdAndUpdate(req.params.relativeId, {
        $addToSet: {
          spouses: {
            spouse: req.params.spouseId,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
          },
        },
      });
      res.json({ msg: 'Spouse added.' });
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
