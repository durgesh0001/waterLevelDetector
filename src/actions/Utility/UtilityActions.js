import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {Alert} from 'react-native';
import {EMAIL_CHANGED,SUPPLIER_FETCH_SUCCESS,ALERT_FETCH_SUCCESS,NAME_CHANGED,QUERY_CHANGED,SUBMIT_QUERY_SUCCESS,SUBMIT_QUERY_FAIL,LoadingStart} from '../types'
import _ from 'lodash';


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
        let ref = firebase.database().ref("/alerts");
        ref.orderByChild("userId").equalTo(`${currentUser.uid}`).limitToLast(100).on("value", snapshot => {
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
export const likeSupplier=(email,is_like)=>{
    return (dispatch) => {
        dispatch({type: LoadingStart});
       if(is_like == true)
       {
           const {currentUser} = firebase.auth();
           firebase.database().ref(`/likes/${currentUser.uid}`)
               .push({email:email,userId:currentUser.uid})
               .then(() => {
                   dispatch ({type: SUBMIT_QUERY_SUCCESS});

               })
               .catch(function (error) {
                   Alert.alert('Error', 'Something is wrong,Please try again');
                   dispatch({type: SUBMIT_QUERY_FAIL});

               });
       }
       else
       {
           const {currentUser} = firebase.auth();
           let ref = firebase.database().ref(`/likes/${currentUser.uid}`);
           ref.orderByChild('email').equalTo(email).once("value", snapshot => {
               let updates = {};
               snapshot.forEach(child => updates[child.key] = null);
               ref.update(updates);
               dispatch({type: SUBMIT_QUERY_SUCCESS, payload:snapshot.val()});
           });
       }
    };
}
/*
   @Method : getSearchSupplier
   @Params :
   @Returns : *
   */
export const getSearchSupplier=(key,value)=>{
    return (dispatch) => {
        dispatch({type: LoadingStart});
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref("/suppliers");
        ref.orderByChild(key).startAt(value).on("value", snapshot => {
            dispatch({type: SUPPLIER_FETCH_SUCCESS, payload:snapshot.val()});
        });
    };
}
/*
   @Method : getSuppliers
   @Params :
   @Returns : *
   */
export const getSuppliers=()=>{
    return (dispatch) => {
        dispatch({type: LoadingStart});
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref("/suppliers");
        ref.on("value", snapshot => {
               let  suppliers =[];
                _.map(snapshot.val(),(val,uid)=>{
                    val.latlng = {
                        latitude:val.latitude,
                        longitude:val.longitude,
                    }
                    val.is_like=false;
                    suppliers.push(val)
                });
            suppliers = suppliers.reverse();
            dispatch({type: SUPPLIER_FETCH_SUCCESS, payload:suppliers});
        });
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
                Alert.alert('Success', 'Query has been submitted successfully');
                dispatch ({type: SUBMIT_QUERY_SUCCESS});

            })
            .catch(function (error) {
                Alert.alert('Error', 'Something is wrong,Please try again');
                dispatch({type: SUBMIT_QUERY_FAIL});


            });
    };
}