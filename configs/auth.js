module.exports = {
        //register a facebook Application at: https://developers.facebook.com/
        'facebookAuth' : {
            'clientID'      : '360428491101384', 
            'clientSecret'  : '4131b473fa56ae9f8a7a4598648766fb', 
            'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
            'callbackURL'   : 'http://phanhoi.net:8081/auth/facebook/callback',
            'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
        },
        //register a google Application at: https://console.developers.google.com
        'googleAuth' : {
            'clientID'      : '559859627701-k2280fm6jc37jcbsi1tqis2mbvboi7ag.apps.googleusercontent.com',
            'clientSecret'  : 'vVaTwiqzVs2wb953YpM7rch_',
            'callbackURL'   : 'http://phanhoi.net:8081/auth/google/callback'
        }
    
    };