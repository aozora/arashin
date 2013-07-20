/*
 * MuContent
 * 
 * The configuration file for each site, this class the application parameters
 *
 * 
 */

// EXPORT THE PARAMS THAT THE APP USES
module.exports = {
    
    // Menu definition
    menu: [
        // title is the handler in the locales files to get the title based on language

       {title: "settings", path: "/settings", acl: {0: true}},
       {title: "theme", path: "/theme", acl: {0: true}},
       {title: "profile", path: "/user/view", acl: {0: true, 1: true}},
//       {title: "registration", path: "/user/create", acl: {1000: true}},
       {title: "logout", path: "/logout", acl: {0: true, 1: true}},
       {title: "login", path: "/login", acl: {1000: true}}
       // Examples:
//	{title: "search", path: "/test", acl: {0: true, 1: false}}, // If you set acl, you resticted the role
//	{title: "search", path: "/test", acl: {1000: true}}, // role 1000 identify guests
//        {title: "you", path: "/you", icon: "icon-off"} // If you don't set acl, all can access
    ]

};
