import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {EMAIL_CHANGED,BASE_URL,SUPPLIER_FETCH_SUCCESS,SUPPLIER_FETCH_SUCCESS_FILTER,ALERT_FETCH_SUCCESS,NAME_CHANGED,QUERY_CHANGED,SUBMIT_QUERY_SUCCESS,SUBMIT_QUERY_FAIL,LoadingStart,showToast} from '../types'
import _ from 'lodash';
import axios from 'axios';




/*
   @Method : OnNameChanged
   @Params :
   @Returns : *
   */
export const OnNameChanged = (text) => {

    return {
        type: NAME_CHANGED,
        payload: text

    }
};
/*
   @Method : OnNameChanged
   @Params :
   @Returns : *
   */
export const OnEmailChanged = (text) => {

    return {
        type: EMAIL_CHANGED,
        payload: text

    }
};
/*
   @Method : OnQueryChanged
   @Params :
   @Returns : *
   */
export const OnQueryChanged = (text) => {

    return {
        type: QUERY_CHANGED,
        payload: text

    }
};

/*
   @Method : getUserDetailsForSettings
   @Params :
   @Returns : *
   */
export const getAlerts=()=>{
    return (dispatch) => {
        dispatch({type: LoadingStart});
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref(`/alerts/${currentUser.uid}`);
        ref.limitToLast(100).on("value", snapshot => {
            dispatch({type: ALERT_FETCH_SUCCESS, payload:snapshot.val()});

        });
    };
}

/*
   @Method : getLocalSearchSupplierList
   @Params :
   @Returns : *
   */
export const getLocalSearchSupplierList=(data)=>{
    return (dispatch) => {
        dispatch({type: LoadingStart});
        dispatch({type: SUPPLIER_FETCH_SUCCESS, payload:data.search});
    };
}

/*
   @Method : getSearchSupplier
   @Params :
   @Returns : *
   */
export const likeSupplier=(supplier_id,email,is_like,uid,callback)=>{
    return (dispatch) => {
        dispatch({type: LoadingStart});
       if(is_like)
       {
           const {currentUser} = firebase.auth();
           firebase.database().ref(`/likes`)
               .push({supplier_id:supplier_id,supplier_email:email,user_id:currentUser.uid})
               .then(() => {
                   callback();

               })
               .catch(function (error) {
                   showToast("danger","Sorry some error occurred, please try again later!");
                   callback();
               });
       }
       else
       {
           let ref = firebase.database().ref(`/likes`);
           ref.orderByChild('supplier_id').equalTo(supplier_id).once("value", snapshot => {
               let updates = {};
               snapshot.forEach(child => updates[child.key] = null);
               ref.update(updates);

               setTimeout(function() { callback(); }.bind(this), 2000);

           });
       }
    };
}
/*
   @Method : getSearchSupplier
   @Params :
   @Returns : *
   */
export const getSearchSupplier=(tank_capacity,tankCity,tankArea)=>{
    return (dispatch) => {
        dispatch({type: LoadingStart});
        const {uid} = firebase.auth().currentUser;
                axios.post(BASE_URL+'supplier/supplierListing', {
                    userId:uid,
                    tankCity: tankCity,
                    tankArea: tankArea,
                    tankCapacity:tank_capacity

                }).then(function (suppliers) {
                    dispatch({type: SUPPLIER_FETCH_SUCCESS, payload:suppliers.data});
                    dispatch({type: SUPPLIER_FETCH_SUCCESS_FILTER, payload:suppliers.data});

                }).catch(function (error) {
                    showToast("danger","Sorry some error occurred, please try again later!");
                    dispatch({type: SUBMIT_QUERY_FAIL});
                });
            }
    }
/*
   @Method : getSuppliers
   @Params :
   @Returns : *
   */
export const getSuppliers=()=>{
    return (dispatch) => {
        const {uid} = firebase.auth().currentUser;
        dispatch({type: LoadingStart});
        navigator.geolocation.getCurrentPosition(
            (position) => {
                axios.post(BASE_URL+'supplier/supplierListing', {
                    userId:uid,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    tankCapacity:[true,true,true,true]

                }).then(function (suppliers) {
                    dispatch({type: SUPPLIER_FETCH_SUCCESS, payload:suppliers.data});
                    dispatch({type: SUPPLIER_FETCH_SUCCESS_FILTER, payload:suppliers.data});
                }).catch(function (error) {
                    showToast("danger","Sorry some error occurred, please try again later!");
                    dispatch({type: SUBMIT_QUERY_FAIL});
                });
            },
            (error) => {
                showToast("danger","Unable to get your loacation!");
                dispatch({type: SUBMIT_QUERY_FAIL});
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
        );
    };
}
/*
   @Method : addContactUsDetails
   @Params :
   @Returns : *
   */
export const addContactUsDetails = ({name,email,query}) => {
    return (dispatch) => {
        dispatch({type: LoadingStart});
        const {currentUser} = firebase.auth();
        firebase.database().ref(`/queries`)
            .push({name,email,query,userId:currentUser.uid})
            .then(() => {
                showToast("success","Query has been submitted successfully");
                dispatch ({type: SUBMIT_QUERY_SUCCESS});
                Actions.Home();

            })
            .catch(function (error) {
                showToast("danger","Sorry some error occurred, please try again later!");
                dispatch({type: SUBMIT_QUERY_FAIL});
            });
    };
}