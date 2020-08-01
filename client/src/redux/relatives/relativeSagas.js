import relativeTypes from './relativeTypes';
import { takeLatest, all } from 'redux-saga/effects';
import {
  getTrees,
  getTree,
  addTree,
  removeTree,
  getRelatives,
  getRelative,
  addRelative,
  updateRelative,
  removeRelative,
  addChild,
  removeChild,
  addRelationship,
  updateRelationship,
  removeRelationship,
} from './relativeActions';

export default function* authSagas() {
  yield all([
    yield takeLatest(relativeTypes.GET_TREES_REQUEST, getTrees),
    yield takeLatest(relativeTypes.GET_TREE_REQUEST, getTree),
    yield takeLatest(relativeTypes.ADD_TREE_REQUEST, addTree),
    yield takeLatest(relativeTypes.REMOVE_TREE_REQUEST, removeTree),
    yield takeLatest(relativeTypes.GET_RELATIVES_REQUEST, getRelatives),
    yield takeLatest(relativeTypes.GET_RELATIVE_REQUEST, getRelative),
    yield takeLatest(relativeTypes.ADD_RELATIVE_REQUEST, addRelative),
    yield takeLatest(relativeTypes.UPDATE_RELATIVE_REQUEST, updateRelative),
    yield takeLatest(relativeTypes.REMOVE_RELATIVE_REQUEST, removeRelative),
    yield takeLatest(relativeTypes.ADD_CHILD_REQUEST, addChild),
    yield takeLatest(relativeTypes.REMOVE_CHILD_REQUEST, removeChild),
    yield takeLatest(relativeTypes.ADD_RELATIONSHIP_REQUEST, addRelationship),
    yield takeLatest(
      relativeTypes.UPDATE_RELATIONSHIP_REQUEST,
      updateRelationship
    ),
    yield takeLatest(
      relativeTypes.REMOVE_RELATIONSHIP_REQUEST,
      removeRelationship
    ),
  ]);
}
