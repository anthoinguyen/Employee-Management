var mongoose = require("mongoose");
var {
  errorProcess,
  success,
  successWithNoData
} = require("../../../services/returnToUsers");
const { check, validationResult } = require("express-validator/check");
var moment = require("moment");
var _ = require("lodash");
var { checkPermission } = require('../../../services/checkPermission')
var constants = require('../../constants');

module.exports = router => {
  router.post("/ngay-nghi/thong-ke", checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let today = new Date();
      var filter = {
        $project: {
          userId: 1,
          name: 1,
          usersCardNumber: 1,
          typeOfUsers: 1,
          departmentName: 1,
          detail: {
            $filter: {
              input: "$detail",
              as: "detail",
              cond: {
                $and: [
                  { $gte: [ "$$detail.year", req.body.year ? req.body.year : new Date().getFullYear() ] },
                  { $lte: [ "$$detail.year", req.body.year ? req.body.year : new Date().getFullYear() ] }
                ]
              }
            }
          }
        }
      };

      let absence = await mongoose.model("absence").aggregate([filter]);
      return success(res, "Done", absence)
    } catch (err) {
      return errorProcess(res, err);
    }
  });
};
