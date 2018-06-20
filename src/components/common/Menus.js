const Menues =
    {
        menu:
            [
                {name: 'Home', link: 'HomeComponent',icon:"home",key:1,submenu:[]},
                {name: 'Device Details', link: 'Devices',icon:"ios-beaker",key:2,submenu:[]},
                {name: 'General Notification', link: 'NotificationSetting',icon:"md-alert",key:3,submenu:[{name:'Alerts', link: 'Alerts',icon:"ios-warning",key:2},{name:'History', link: 'History',icon:"ios-stopwatch",key:1}]},
                {name: 'Notification Settings', link: 'NotificationSetting',icon:"md-settings",key:4,submenu:[]},
                {name: 'Profile', link: 'Profile',icon:"md-person",key:4,submenu:[{name: 'User Profile', link: 'Profile',icon:"md-person",key:2},{name:'Change Password', link:'ChangePasswordForm',icon:"ios-person",key:1}]},
                {name: 'Connect Device', link: 'BluetoothComponents',icon:"md-bluetooth"},
                {name: 'Contact Us', link: 'ContactUs',icon:"ios-call",key:6,submenu:[]},
                {name: 'Terms & Policy', link: 'TermsAndPolicy',icon:"ios-paper",key:7,submenu:[]},
                {name: 'Logout', link: 'Logout',icon:"ios-log-out",key:8,submenu:[]},


            ]
    }
export {Menues};
