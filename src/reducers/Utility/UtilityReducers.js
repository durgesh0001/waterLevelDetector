import {EMAIL_CHANGED,SUPPLIER_FETCH_SUCCESS,NAME_CHANGED,QUERY_CHANGED,SUBMIT_QUERY_SUCCESS,SUBMIT_QUERY_FAIL,ALERT_FETCH_SUCCESS,LoadingStart} from '../../actions/types';
const INITIAL_STATE = {email:'',name:'',query:'',error:'',loading:false,alerts:'',suppliers:[]};
export default (state=INITIAL_STATE,action) =>
{
    switch(action.type)
    {
        case EMAIL_CHANGED:
            return {...state,email:action.payload,loading:false};
        case NAME_CHANGED:
            return {...state,name:action.payload,loading:false};
        case QUERY_CHANGED:
            return {...state,query:action.payload,loading:false};
        case SUBMIT_QUERY_SUCCESS:
            return {...state,query:'',loading:false};
        case SUBMIT_QUERY_FAIL:
            return {...state,loading:false};
        case ALERT_FETCH_SUCCESS:
            return {...state,loading:false,alerts:action.payload};
        case SUPPLIER_FETCH_SUCCESS:
            return {...state,loading:false,suppliers:action.payload}
        case LoadingStart:
            return {...state,loading:true};
        default:
            return state;
    }
}
