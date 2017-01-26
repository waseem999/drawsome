import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default, 
  warnings: require('./warnings.jsx').default,
  friends: require('./friends.jsx').default,
  drawings: require('./drawings.jsx').default,
})

export default rootReducer
