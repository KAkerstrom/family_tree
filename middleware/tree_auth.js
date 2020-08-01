const Tree = require('../models/Tree');
const roles = require('../utils/roles');

module.exports = async (req, res, next) => {
  const tree = await Tree.findOne({ _id: req.params.treeId }, 'users private');
  if (tree) {
    const user = tree.users.find((x) => x.user.toString() === req.user.id);
    if (!user) res.role = tree.private ? roles.blocked : roles.read;
    else res.role = user.role;
    next();
  } else
    return res
      .status(500)
      .json({ errors: ['Tree not found, or permission denied.'] });
};
