import {EMAIL_CHANGED,RESET_USER,PHONE_CHANGED,CONFIRM_PASSWORD_CHANGED,PASSWORD_CHANGED,FETCH_AUTH_DETAIL_SUCCESS,FIRST_NAME_CHANGED,LAST_NAME_CHANGED,LOGIN_USER_SUCCESS,LOGIN_USER_FAIL,LOGIN_USER,FORGOT_PASSWORD_REQUEST,FORGOT_PASSWORD_SUCCESS,ON_CHANGE_IMAGE_SUCCESS} from '../../actions/types';
const INITIAL_STATE = {email:'',password:'',phone:'',user:null,error:'',first_name:'',last_name:'',loading:false,ProfilePicture:''};
export default (state=INITIAL_STATE,action) =>
{
    switch(action.type)
    {
        case EMAIL_CHANGED:
            return {...state,email:action.payload};
        case PHONE_CHANGED:
            return {...state,phone:action.payload};
        case PASSWORD_CHANGED:
            return {...state,password:action.payload};
        case CONFIRM_PASSWORD_CHANGED:
            return {...state,confirm_password:action.payload};
        case FIRST_NAME_CHANGED:
            return {...state,first_name:action.payload};
        case LAST_NAME_CHANGED:
            return {...state,last_name:action.payload};
        case LOGIN_USER_SUCCESS:
            return {...state,...INITIAL_STATE,user:action.payload,error:'',loading:false};
        case LOGIN_USER:
            return {...state,loading:true};
        case FORGOT_PASSWORD_REQUEST:
            return {...state,loading:true};
        case FORGOT_PASSWORD_SUCCESS:
            return {...state,loading:false};
        case LOGIN_USER_FAIL:
            return {...state,error:'',password:'',loading:false};
        case FETCH_AUTH_DETAIL_SUCCESS:
            return {...state,authDetails:action.payload,ProfilePicture:action.payload.photoURL,userDetails:action.userDetails,first_name:action.userDetails.first_name,last_name:action.userDetails.last_name,uid:action.uid};
        case RESET_USER:
            return {...state,...INITIAL_STATE,error:'',loading:false}
        case ON_CHANGE_IMAGE_SUCCESS:
            return {...state,loading:false,ProfilePicture:action.payload}
        default:
            return state;
    }
}
