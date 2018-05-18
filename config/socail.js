
module.exports = {

    'facebookAuth': {
        'clientID': '2031274237130992', // App ID
        'clientSecret': 'f6f21acd2643f985bf5b93806598a8b2', // App Secret
        'callbackURL': 'https://localhost:3000/users/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields': ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },
    'googleAuth': {
        'clientID': '413767204471-2edr4k9udgg9gjakm8l8t5q37qluniuv.apps.googleusercontent.com',
        'clientSecret': 'F3Yr0tInnxhYaPv0BdpFbmnr',
        'callbackURL': 'https://localhost:3000/users/auth/google/callback'
    }

};
