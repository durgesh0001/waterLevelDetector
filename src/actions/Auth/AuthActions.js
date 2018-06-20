import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {
    EMAIL_CHANGED,
    RESET_USER,
    CONFIRM_PASSWORD_CHANGED,
    ON_CHANGE_IMAGE_SUCCESS,
    FIRST_NAME_CHANGED,
    FETCH_AUTH_DETAIL_SUCCESS,
    LAST_NAME_CHANGED,
    NAME_CHANGED,
    ON_ADDRESS_CHANGE,
    PASSWORD_CHANGED,
    PHONE_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_REQUEST,
    showToast
} from '../types'
import RNFetchBlob from 'react-native-fetch-blob';
import FCM from 'react-native-fcm';


/*
   @Method : NameChanged
   @Params :
   @Returns : *
   */
export const NameChanged = (text) => {
    return {
        type: NAME_CHANGED,
        payload: text

    }
};


/*
   @Method : emailChanged
   @Params :
   @Returns : *
   */
export const phoneChanged = (text) => {

    return {
        type: PHONE_CHANGED,
        payload: text

    }
};
/*
   @Method : emailChanged
   @Params :
   @Returns : *
   */
export const emailChanged = (text) => {

    return {
        type: EMAIL_CHANGED,
        payload: text

    }
};

/*
   @Method : onAddressChange
   @Params :
   @Returns : *
   */
export const onAddressChange = (text) => {

    return {
        type: ON_ADDRESS_CHANGE,
        payload: text

    }
};

/*
   @Method : passwordChanged
   @Params :
   @Returns : *
   */
export const passwordChanged = (text) => {

    return {
        type: PASSWORD_CHANGED,
        payload: text

    }
};


/*
   @Method : changeProfilePicture
   @Params :
   @Returns : *
   */
export const changeProfilePicture = (imageData) => {
    return (dispatch) => {
        dispatch({type: ON_CHANGE_IMAGE_SUCCESS, payload: imageData.path, loading: false});
    }

};

/*
   @Method : confirmPasswordChanged
   @Params :
   @Returns : *
   */
export const confirmPasswordChanged = (text) => {

    return {
        type: CONFIRM_PASSWORD_CHANGED,
        payload: text

    }
};


/*
   @Method : firstNameChanged
   @Params :
   @Returns : *
   */
export const firstNameChanged = (text) => {

    return {
        type: FIRST_NAME_CHANGED,
        payload: text

    }
};
/*
   @Method : lastNameChanged
   @Params :
   @Returns : *
   */
export const lastNameChanged = (text) => {

    return {
        type: LAST_NAME_CHANGED,
        payload: text

    }
};

/*
   @Method : forgotPassword
   @Params :
   @Returns : *
   */
export const forgotPassword = ({email}) => {
    return (dispatch) => {
        dispatch({type: FORGOT_PASSWORD_REQUEST});

        firebase.auth().sendPasswordResetEmail(email)
            .then(user => {
                showToast("success","We have received your request and an email containing reset password link has been send to your registered email.")
                dispatch({type: FORGOT_PASSWORD_SUCCESS});
            })
            .catch(() => {
                showToast("danger",`Account with email "${email}" not found.`)
                dispatch({type: FORGOT_PASSWORD_SUCCESS});
            })
    };
}

/*
   @Method : registerUser
   @Params :
   @Returns : *
   */
export const registerUser = ({email,password,phone}) => {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => {
                firebase.database().ref(`/users`)
                    .push({email,password,phone,id:user.uid,is_online:true,created_at:Date.now(),is_deleted:false,is_admin:false,profile_picture:'',is_user_notification:true})
                    .then((usersRecords) => {
                       firebase.auth().currentUser.sendEmailVerification();
                        var user = firebase.auth().currentUser;
                        user.updateProfile({
                            displayName: "",
                            photoURL: "",
                            phoneNumber:phone
                        }).then(function () {
                            let refUser = firebase.database().ref(`/users`);
                            refUser.orderByChild("is_admin").equalTo(true).once('value')
                                .then(function(dataSnapshotUser) {
                                    _.map(dataSnapshotUser.val(),(valUserData,uid)=> {
                                        firebase.database().ref(`/alerts/${valUserData.id}`)
                                            .push({message:`New user ${user.email} is register into your system`,type:"newUser",user_id:usersRecords.getKey()})
                                            .then(() => {
                                                loginUserSuccess(dispatch, user);
                                                Actions.Congrats();
                                            }).catch(function (error) {
                                            loginUserFail(dispatch);
                                            showToast("danger","Sorry some error occurred, please try again later!");
                                        });
                                     })
                                }).catch(function (error) {
                                loginUserFail(dispatch);
                                showToast("danger","Sorry some error occurred, please try again later!");
                            });
                        }).catch(function (error) {
                            loginUserFail(dispatch);
                            showToast("danger","Sorry some error occurred, please try again later!");
                        });

                    })
                    .catch(() => {
                        loginUserFail(dispatch);
                        showToast("danger","Sorry some error occurred, please try again later!");
                    })
            })
            .catch(() => {
                loginUserFail(dispatch);
                showToast("danger","The email address you have entered is already registered.");

            })
    };
}

/*
   @Method : getUserDetails
   @Params :
   @Returns : *
   */
export const getUserDetails=()=>{
    return (dispatch) => {
        dispatch({type: LOGIN_USER})
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref("/users");
        ref.orderByChild("id").equalTo(`${currentUser.uid}`).on("value", snapshot => {
            _.map(snapshot.val(),(val,uid)=>{
                val.userId = uid;
                if(val.is_deleted == true)
                {
                    firebase.auth().signOut().then(function() {
                        Actions.Auth();
                    }, function(error) {
                        Alert.alert('Error', 'Something is wrong,Please try again');
                    });

                }
                else
                {
                    dispatch({type: FETCH_AUTH_DETAIL_SUCCESS, payload:val});

                }
            });
        });
    };
}




/*
   @Method : changePassword
   @Params :
   @Returns : *
   */
export const changePassword = ({old_password,password}) => {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        let user = firebase.auth().currentUser;
        firebase.auth().signInWithEmailAndPassword(user.email, old_password)
            .then(userData => {
                user.updatePassword(password).then(function () {
                    firebase.auth().signInWithEmailAndPassword(user.email, password)
                        .then(userData => {
                            showToast("success","Your password has been changed successfully.");
                            loginUserSuccess(dispatch, user);
                            Actions.pop();
                        })
                        .catch(() => {
                            showToast("danger","Sorry some error occurred, please try again later!");
                            loginUserFail(dispatch);
                        })
                }).catch(function (error) {
                    showToast("danger","Sorry some error occurred, please try again later!");
                    loginUserFail(dispatch);
                });
            })
            .catch(() => {
                showToast("danger","The Old Password entered was invalid.");
                loginUserFail(dispatch);
            })
    };
};


/*
   @Method : uploadPhoto
   @Params :
   @Returns : *
   */
export const uploadPhoto = (file,userId) => {
    const polyfill = RNFetchBlob.polyfill;
    window.XMLHttpRequest = polyfill.XMLHttpRequest;
    window.Blob = polyfill.Blob;
    const sessionId = new Date().getTime();
    let uploadBlob = null;
    const imageRef = firebase.storage().ref('images/').child(`${sessionId}.png`)

    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        let path = file.path;
        Blob.build(RNFetchBlob.wrap(path), {type: 'image/jpeg'})
            .then((blob) => imageRef
                .put(blob, {contentType: 'image/png'})
            ).then((snapshot) => {
         }).then(() => {
                return imageRef.getDownloadURL();
            })
            .then((url) => {
                var user = firebase.auth().currentUser;
                firebase.database().ref(`/users/${userId}`)
                    .update({profile_picture:url})
                    .then(() => {
                        user.updateProfile({
                            photoURL: url
                        }).then(function() {
                            dispatch({type: ON_CHANGE_IMAGE_SUCCESS, payload: url, loading: false});
                            dispatch({type: LOGIN_USER_FAIL});
                            showToast("success","Profile has been updated successfully.");
                        }).catch(function(error) {
                            loginUserFail(dispatch);
                            showToast("danger","Sorry some error occurred, please try again later!");
                        });
                    })
            }).catch((error) => {
            showToast("danger","Sorry some error occurred, please try again later!");
            dispatch({type: LOGIN_USER_FAIL});
        })
    }
};

/*
   @Method : updateProfile
   @Params :
   @Returns : *
   */
export const updateProfile = ({name='', address='', profile_picture = '', userId}) => {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        const {currentUser} = firebase.auth();
        firebase.database().ref(`/users/${userId}`)
            .update({name, address, profile_picture})
            .then(() => {
                let user = firebase.auth().currentUser;
                user.updateProfile({
                    photoURL: profile_picture,
                    displayName:name
                }).then(function () {
                    showToast("success","Profile has been updated successfully.");
                    dispatch({type: LOGIN_USER_FAIL});
                }).catch(function (error) {
                    showToast("danger","Sorry some error occurred, please try again later!");
                    loginUserFail(dispatch);

                });

            })
    };
};
/*
   @Method : resetForm
   @Params :
   @Returns : *
   */
export const resetForm = () => {
    return (dispatch) => {
        dispatch({type: RESET_USER});
    }
};

/*
   @Method : updateUserState
   @Params :
   @Returns : *
   */
export const updateUserState = ({isOnline}) => {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        const {currentUser} = firebase.auth();

        firebase.database().ref(`/users/${currentUser.uid}`)
            .push({isOnline})
            .then(() => {
                loginUserSuccess(dispatch, currentUser);
            })

    };
};



/*
   @Method : loginUser
   @Params :
   @Returns : *
   */
export const loginUser = ({email, password}) => {

    return (dispatch) => {
        dispatch({type: LOGIN_USER});

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                let userDetails = firebase.auth().currentUser;
                if(userDetails.emailVerified)
                {
                    let refUser = firebase.database().ref(`/users`);
                    refUser.orderByChild("id").equalTo(userDetails.uid).once('value')
                        .then(function(dataSnapshotUser) {
                            if (dataSnapshotUser.val() != null) {
                                _.map(dataSnapshotUser.val(),(valUserData,uid)=>{
                                    if(valUserData.is_deleted == true)
                                    {
                                        firebase.auth().signOut().then(function() {
                                            showToast("danger","Your account has been disabled, please contact your system administrator");
                                            loginUserFail(dispatch);
                                            Actions.Auth();

                                        }, function(error) {
                                            showToast("danger","Sorry some error occurred, please try again later!")
                                            Actions.Auth();
                                            loginUserFail(dispatch);
                                        });
                                    }
                                    else if(valUserData.is_admin == true)
                                    {
                                        firebase.auth().signOut().then(function() {
                                            showToast("danger","Invalid email or password,Please try again!")
                                            loginUserFail(dispatch);
                                            Actions.Auth();

                                        }, function(error) {
                                            showToast("danger","Invalid email or password,Please try again!")
                                            Actions.Auth();
                                            loginUserFail(dispatch);
                                        });
                                    }
                                    else
                                    {
                                        FCM.getFCMToken().then(token => {
                                            let ref = firebase.database().ref(`/tokens/${user.uid}`);
                                            ref.orderByChild("device_token").equalTo(token).once('value')
                                                .then(function(dataSnapshot) {
                                                    if(dataSnapshot.val() == null)
                                                    {
                                                        let user = firebase.auth().currentUser;
                                                        firebase.database().ref(`/tokens/${user.uid}`)
                                                            .push({device_token:token,updated_at:Date.now()})
                                                            .then(() => {
                                                                loginUserSuccess(dispatch, user);
                                                                Actions.Home({type:'reset'});
                                                            })
                                                            .catch(() => {
                                                                loginUserFail(dispatch);
                                                                showToast("danger","Sorry some error occurred, please try again later!")
                                                            })
                                                    }
                                                    else
                                                    {
                                                        loginUserSuccess(dispatch, user);
                                                        Actions.Home({type:'reset'});
                                                    }
                                                })
                                                .catch(() => {
                                                    loginUserFail(dispatch);
                                                    showToast("danger","Sorry some error occurred, please try again later!")

                                                });
                                        }).catch(() => {
                                            loginUserFail(dispatch);
                                            showToast("danger","Sorry some error occurred, please try again later!")

                                        });
                                    }

                                });
                            }
                            else
                            {
                                firebase.auth().signOut().then(function() {
                                    showToast("danger","Invalid email or password,Please try again!")
                                    loginUserFail(dispatch);

                                }, function(error) {
                                    showToast("danger","Invalid email or password,Please try again!")
                                    loginUserFail(dispatch);
                                });
                            }
                        })
                        .catch(() => {
                            firebase.auth().signOut().then(function() {
                                showToast("danger","Invalid email or password,Please try again!")
                                loginUserFail(dispatch);

                            }, function(error) {
                                showToast("danger","Invalid email or password,Please try again!")
                                loginUserFail(dispatch);
                            });
                        })
                }
                else
                {
                    Actions.Verify();
                }
            })
            .catch(() => {
                showToast("danger","Invalid email or password,Please try again!")
                loginUserFail(dispatch);
            })
    };
};

/*
   @Method : getCurrentUserAuthDetails
   @Params :
   @Returns : *
   */
export const getCurrentUserAuthDetails = () => {
    const {currentUser} = firebase.auth();
    return (dispatch) => {
        firebase.database().ref(`/users/${currentUser.uid}`)
            .on('child_added', snapshot => {
                dispatch({
                    type: FETCH_AUTH_DETAIL_SUCCESS,
                    payload: currentUser,
                    userDetails: snapshot.val(),
                    uid: snapshot.key
                });

            });
    }
};

/*
   @Method : loginUserSuccess
   @Params :
   @Returns : *
   */
const loginUserSuccess = (dispatch, user) => {
    dispatch({type: LOGIN_USER_SUCCESS, payload: user});

};

/*
   @Method : loginUserFail
   @Params :
   @Returns : *
   */
const loginUserFail = (dispatch) => {
    dispatch({type: LOGIN_USER_FAIL});

};