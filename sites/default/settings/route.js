/*
 * MuContent
 * 
 * The configuration file for each site, this class the application parameters
 *
 * 
 */

// EXPORT THE PARAMS THAT THE APP USES
module.exports = {

    routing_acl: [ // Set the acl for single route
/*      Example:
        {route: '/logout', acl: {0: true, 1: true}},
        // Put in route the same route defined in express.js, for example, a route with params:
         {route: '/objects/edit/:id', acl: {0: true, 1: true}, ajax: true},
*/
    ], // Role legend: 0 (admin), 1 (user), 1000 (guest), add other if you want and modify the defaults
    
};
