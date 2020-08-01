import relativeTypes from './relativeTypes';

export const getTrees = () => ({
  type: relativeTypes.GET_TREES_REQUEST,
});

export const getTree = (treeId) => ({
  type: relativeTypes.GET_TREE_REQUEST,
  payload: { treeId },
});

export const addTree = () => ({
  type: relativeTypes.ADD_TREE_REQUEST,
});

export const removeTree = (treeId) => ({
  type: relativeTypes.REMOVE_TREE_REQUEST,
  payload: { treeId },
});

export const getRelatives = (treeId) => ({
  type: relativeTypes.GET_RELATIVES_REQUEST,
  payload: { treeId },
});

export const getRelative = (treeId, relativeId) => ({
  type: relativeTypes.GET_RELATIVE_REQUEST,
  payload: { treeId, relativeId },
});

export const addRelative = (treeId, relative) => ({
  type: relativeTypes.ADD_RELATIVE_REQUEST,
  payload: { treeId, relative },
});

export const updateRelative = (treeId, relativeId, relative) => ({
  type: relativeTypes.UPDATE_RELATIVE_REQUEST,
  payload: { treeId, relativeId, relative },
});

export const removeRelative = (treeId, relativeId) => ({
  type: relativeTypes.REMOVE_RELATIVE_REQUEST,
  payload: { treeId, relativeId },
});

export const addChild = (treeId, relativeId, childId) => ({
  type: relativeTypes.ADD_CHILD_REQUEST,
  payload: { treeId, relativeId, childId },
});

export const removeChild = (treeId, relativeId, childId) => ({
  type: relativeTypes.REMOVE_CHILD_REQUEST,
  payload: { treeId, relativeId, childId },
});

export const addRelationship = (
  treeId,
  relativeId,
  spouseId,
  start_date = null,
  end_date = null
) => ({
  type: relativeTypes.ADD_RELATIONSHIP_REQUEST,
  payload: { treeId, relativeId, spouseId, start_date, end_date },
});

export const updateRelationship = (
  treeId,
  relativeId,
  relationshipId,
  start_date = null,
  end_date = null
) => ({
  type: relativeTypes.UPDATE_RELATIONSHIP_REQUEST,
  payload: { treeId, relativeId, relationshipId, start_date, end_date },
});

export const removeRelationship = (treeId, relativeId, relationshipId) => ({
  type: relativeTypes.REMOVE_RELATIONSHIP_REQUEST,
  payload: { treeId, relativeId, relationshipId },
});
