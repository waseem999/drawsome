import axios from 'axios';
import {setAllMasterpieces} from './drawings'
import {setAllVersions} from './versions'

const transformFriend = (friendObj)=> {
	const chatDrawingId = friendObj.friendship.chat_drawing_id
	friendObj.chatId = chatDrawingId
	delete friendObj.friendship
	return friendObj
}

const initialState = {}

const reducer = (state=initialState, action) => {
	const nextState = Object.assign({}, state);
	switch(action.type){
		case GET_FRIEND:
			nextState[action.friend.id] = action.friend
			break;
		case REMOVE_FRIEND:
			nextState[action.friend.id] = null
			break;
		default: 
			return state
	}
	return nextState
}

// CONSTANTS

export const GET_FRIEND = 'GET_FRIEND'
export const REMOVE_FRIEND = 'REMOVE_FRIEND'

// ACTION CREATORS

export const getFriend = (friend) => {
	
	let personDrawings = friend.drawings
	friend.drawings = []
	personDrawings.drawings && personDrawings.forEach(drawing => friend.drawings.push(drawing.id))
	let personVersions = friend.versions 
	friend.versions = []
	personVersions && personVersions.forEach(version => friend.versions.push(version.id))
	return {
	  type: GET_FRIEND, 
	  friend: transformFriend(friend)
	}
}

export const removeFriend = (friend) => {
	return {
	  type: REMOVE_FRIEND, 
	  friend
	}
}

export const getAllFriends = (allFriends) => {
	return dispatch => {
		allFriends.forEach(friend => {
			dispatch(setAllMasterpieces(friend.drawings))
			dispatch(setAllVersions(friend.versions))
			dispatch(getFriend(friend))
		})
	}
}

export const setAllFriends = (id) => {
	return dispatch => {
		return axios.get(`/api/users/${id}/friends`)
		.then(response => {
			if(response.data.friend){
				dispatch(getAllFriends(response.data.friend))
			}
		})
		.catch((err)=> console.log(err))
	}
}

export default reducer