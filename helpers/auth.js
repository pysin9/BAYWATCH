const alertMessage = require('./messenger'); // Bring in alert messenger
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // If user is authenticated
        return next(); // Calling next() to proceed to the next statement
    }
    // If not authenticated, show alert message and redirect to ‘/’
    alertMessage(res, 'danger', 'You need to sign up/ login to do this', true);
    res.redirect('/');
};
module.exports = ensureAuthenticated;