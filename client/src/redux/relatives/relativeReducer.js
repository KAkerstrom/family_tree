import relativeTypes from './relativeTypes';

const initialState = {
  trees: null,
  relatives: null,
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case relativeTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case relativeTypes.GET_TREES_SUCCESS:
      return {
        ...state,
        loading: false,
        trees: action.payload.reduce((obj, tree) => {
          obj[tree._id] = tree;
          return obj;
        }, {}),
      };

    case relativeTypes.GET_RELATIVES_SUCCESS:
      return {
        ...state,
        loading: false,
        relatives: action.payload.reduce((obj, relative) => {
          obj[relative._id] = relative;
          return obj;
        }, {}),
      };

    case relativeTypes.ADD_TREE_SUCCESS:
    case relativeTypes.GET_TREE_SUCCESS:
    case relativeTypes.UPDATE_TREE_SUCCESS:
      return {
        ...state,
        loading: false,
        trees: { ...state.trees, [action.payload._id]: action.payload },
      };

    case relativeTypes.ADD_RELATIVE_SUCCESS:
    case relativeTypes.GET_RELATIVE_SUCCESS:
    case relativeTypes.UPDATE_RELATIVE_SUCCESS:
      return {
        ...state,
        loading: false,
        relatives: { ...state.relatives, [action.payload._id]: action.payload },
      };

    case relativeTypes.ADD_CHILD_SUCCESS:
      return {
        ...state,
        loading: false,
        relatives: {
          ...state.relatives,
          [action.payload.relativeId]: {
            ...state.relatives[action.payload.relativeId],
            children: [
              ...state.relatives[action.payload.relativeId].children,
              action.payload.childId,
            ],
          },
          [action.payload.childId]: {
            ...state.relatives[action.payload.childId],
            parents: [
              ...state.relatives[action.payload.childId].parents,
              action.payload.relativeId,
            ],
          },
        },
      };

    case relativeTypes.REMOVE_CHILD_SUCCESS:
      return {
        ...state,
        loading: false,
        relatives: {
          ...state.relatives,
          [action.payload.relativeId]: {
            ...state.relatives[action.payload.relativeId],
            children: state.relatives[
              action.payload.relativeId
            ].children.filter((x) => x !== action.payload.childId),
          },
          [action.payload.childId]: {
            ...state.relatives[action.payload.childId],
            parents: state.relatives[action.payload.childId].parents.filter(
              (x) => x !== action.payload.relativeId
            ),
          },
        },
      };

    case relativeTypes.REMOVE_TREE_SUCCESS:
      return {
        ...state,
        loading: false,
        trees: state.trees.filter((x) => x._id !== action.payload),
      };

    case relativeTypes.REMOVE_RELATIVE_SUCCESS:
      return {
        ...state,
        loading: false,
        relatives: state.relatives.filter((x) => x._id !== action.payload),
      };

    case 'CLEAR_ALL':
    case relativeTypes.CLEAR_RELATIVES:
      return initialState;

    default:
      return state;
  }
};
