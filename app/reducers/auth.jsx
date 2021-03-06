import axios from 'axios'
import {browserHistory} from 'react-router'
import {loginIssue, signinIssue} from './warnings'
import { getFriendships } from './friendships'
import { getDrawings, receiveDrawings } from './drawings'


const reducer = (state=null, action) => {
  switch(action.type) {
  case AUTHENTICATED:
    return action.user  
  }
  return state
}

const AUTHENTICATED = 'AUTHENTICATED'
export const authenticated = user => ({
  type: AUTHENTICATED, user
})

export const login = (username, password) =>
  dispatch =>
    axios.post('/api/auth/local/login',
      {username, password})
      .then(() => {
        dispatch(whoami())
        browserHistory.push('/gallery')
      })
      .catch(() => {
        dispatch(whoami())
        dispatch(loginIssue())
      })   

export const signup = (firstName, lastName, birthday, email, password) =>
  dispatch => 
    axios.post('/api/users', {firstName, lastName, birthday, email, password})
    .then((res) => {
      dispatch(login(res.data.email, res.data.password))
      browserHistory.push('/gallery')
    })
    .then(()=> dispatch(whoami()))
    .catch(() => {
      dispatch(whoami())
      dispatch(signinIssue())
    })   

export const logout = () =>
  dispatch =>
    axios.post('/api/auth/logout')
      .then(() => {
        dispatch(whoami())
        browserHistory.push('/login')
      })
      .catch(() => dispatch(whoami()))

export const whoami = () =>
  dispatch =>
    axios.get('/api/auth/whoami')
    .then(response => {
      const user = response.data
      if(user){
        dispatch(authenticated(response.data))
      }
      if(user.followers || user.folowees)
        dispatch(getFriendships())
      if(user.drawings){
        dispatch(receiveDrawings(user.drawings))
        // dispatch(getDrawings())
      } 
    })
    .catch(failed => {
      dispatch(authenticated(null))
      browserHistory.push('/login')
    })

export default reducer