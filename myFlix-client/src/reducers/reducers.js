import { combineReducers} from 'redux';

import { SET_FILTER, SET_MOVIES, SET_USER, UPDATE_USER} from '../actions/actions';

function visibilityFilter (state = '', action){
  switch (action.type){
    case SET_FILTER:
      return action.value;
      default:
        return state;
  }
}

function movies(state = [], action){
switch (action.type){
  case SET_MOVIES:
    return action.value;
    default:
      return state;
  }
}

function user(state = [], action){
switch (action.type){
  case SET_USER:
    return action.user;
  
  case UPDATE_USER:
    return action.value;

    default:
      return state; 
  }
}

const moviesApp = combineReducers({
  visibilityFilter,
  movies,
  user
});

export default moviesApp;