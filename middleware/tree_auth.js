const Tree = require('../models/Tree');
const roles = require('../utils/roles');

module.exports = async (req, res, next) => {
  const tree = await Tree.findOne(
    { _id: req.params.treeId },
    'members private'
  );
  if (tree) {
    const member = tree.members.find((x) => x.user.toString() === req.user.id);
    if (!member) res.role = tree.private ? roles.blocked : roles.read;
    else res.role = member.role;
    next();
  } else
    return res
      .status(500)
      .json({ errors: ['Tree not found, or permission denied.'] });
};
