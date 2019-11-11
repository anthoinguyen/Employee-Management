var _ = require("lodash");
var { redirectLogin } = require('./returnToUsers')
module.exports = {
  checkPermission: (...allowed) => {
    const isAllowed = (usersRole = []) => {
      // Check permission of user is allow in action Role
      // If actionRole is * return true
      if (_.intersection(...allowed, ["*"]).length > 0) {
        return true;
      } else {
        // If it content, 2 array is greater than 0
        if (_.intersection(usersRole, ...allowed).length > 0) {
          return true;
        }
        return false;
      }
    };

    // return a middleware
    return (req, res, next) => {
      if (req.isAuthenticated()) {
        if (isAllowed(req.user.roles)) {
          next();
        } else {
          // role is allowed, so continue on the next middleware
          return res.status(403).json({ message: "Forbidden" }); // user is forbidden
        }
      } else {
        return redirectLogin(res);
      }
    };
  }
};
