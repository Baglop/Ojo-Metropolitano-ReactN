import { combineReducers } from 'redux';
import authsuscribe from './authsuscribe';
import login from './login';
import token from './tokenFirebase';
import location from './location';
import update_user from './update_user';
import user_reports from './user_reports';
import user_friends from './user_friends';
import permissions from './permissions';
import home from './home'

export default combineReducers({
    authsuscribe,
    login,
    token,
    location,
    update_user,
    user_reports,
    user_friends,
    permissions,
    home
})