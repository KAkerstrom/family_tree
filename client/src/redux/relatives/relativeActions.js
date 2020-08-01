import relativeTypes from './relativeTypes';
import callApi from '../../utils/callApi';

export function* getTrees(action) {
  yield callApi({
    method: 'get',
    url: '/trees',
    type: 'GET_TREES',
    errorMessage: 'There was an error while getting trees.',
  });
}

export function* getTree(action) {
  yield callApi({
    method: 'get',
    url: `/trees/${action.payload.treeId}`,
    type: 'GET_TREE',
    errorMessage: 'There was an error while getting a tree.',
  });
}

export function* addTree(action) {
  yield callApi({
    method: 'post',
    url: '/trees',
    type: 'ADD_TREES',
    errorMessage: 'There was an error while creating a tree.',
  });
}

export function* removeTree(action) {
  yield callApi({
    method: 'delete',
    url: `/trees/${action.payload.treeId}`,
    type: 'REMOVE_TREES',
    errorMessage: 'There was an error while deleting a tree.',
  });
}

export function* getRelatives(action) {
  yield callApi({
    method: 'get',
    url: `/trees/${action.payload.treeId}/relatives`,
    type: 'GET_RELATIVES',
    errorMessage: 'There was an error while getting relatives.',
  });
}

export function* getRelative(action) {
  yield callApi({
    method: 'get',
    url: `/trees/${action.payload.treeId}/relatives/${action.payload.relativeId}`,
    type: 'GET_RELATIVE',
    errorMessage: 'There was an error while getting a relative.',
  });
}

export function* addRelative(action) {
  yield callApi({
    method: 'post',
    url: `/trees/${action.payload.treeId}/relatives`,
    type: 'ADD_RELATIVE',
    body: action.payload.relative,
    errorMessage: 'There was an error while creating a relative.',
  });
}

export function* updateRelative(action) {
  yield callApi({
    method: 'put',
    url: `/trees/${action.payload.treeId}/relatives${action.payload.relativeId}`,
    type: 'UPDATE_RELATIVE',
    body: action.payload.relative,
    errorMessage: 'There was an error while updating a relative.',
  });
}

export function* removeRelative(action) {
  yield callApi({
    method: 'delete',
    url: `/trees/${action.payload.treeId}/relatives${action.payload.relativeId}`,
    type: 'REMOVE_RELATIVE',
    errorMessage: 'There was an error while deleting a relative.',
  });
}

export function* addChild(action) {
  yield callApi({
    method: 'post',
    url: `/trees/${action.payload.treeId}/relatives${action.payload.relativeId}/children`,
    type: 'ADD_CHILD',
    errorMessage: 'There was an error while adding a child to a relative.',
  });
}

export function* removeChild(action) {
  yield callApi({
    method: 'delete',
    url: `/trees/${action.payload.treeId}/relatives${action.payload.relativeId}/children/${action.payload.childId}`,
    type: 'REMOVE_CHILD',
    errorMessage: 'There was an error while removing a child from a relative.',
  });
}

export function* addRelationship(action) {
  yield null;
}

export function* updateRelationship(action) {
  yield null;
}

export function* removeRelationship(action) {
  yield null;
}
