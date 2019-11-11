var mongoose = require("mongoose");
var moment = require("moment");
var { success, errorProcess } = require("../../../services/returnToUsers");
var _ = require('lodash');
var { checkPermission } = require('../../../services/checkPermission')
var constants = require('../../../routes/constants');

module.exports = router => {
  router.get("/su-kien-sap-dien-ra", checkPermission(constants.IS_USER), async (req, res, next) => {
    try {
      var today = new Date();
  
      var birthdayNexta1 = {
        $addFields: {
          today: {
            $dateFromParts: {
              year: { $year: today },
              month: { $month: today },
              day: { $dayOfMonth: today }
            }
          },
          birthdayThisYear: {
            $dateFromParts: {
              year: { $year: today },
              month: { $month: "$birthday" },
              day: { $dayOfMonth: "$birthday" }
            }
          },
          birthdayNextYear: {
            $dateFromParts: {
              year: { $add: [1, { $year: today }] },
              month: { $month: "$birthday" },
              day: { $dayOfMonth: "$birthday" }
            }
          }
        }
      };
      var birthdayNexta2 = {
        $addFields: {
          nextBirthday: {
            $cond: [
              { $gte: ["$birthdayThisYear", "$today"] },
              "$birthdayThisYear",
              "$birthdayNextYear"
            ]
          }
        }
      };
      var birthdayNextp1 = {
        $project: {
          name: 1,
          birthday: 1,
          usersCardNumber: 1,
          _id: 1,
          belongToDepartment: 1,
          daysTillNextBirthday: {
            $divide: [
              { $subtract: ["$nextBirthday", "$today"] },
              24 * 60 * 60 * 1000 /* milliseconds in a day */
            ]
          },
          _id: 0
        }
      };
      var birthdayNexts1 = {
        $match: {
          daysTillNextBirthday: {
            $gte: 0,
            $lte: 30
          }
        }
      };
      let birthdayNext = await mongoose
        .model("users")
        .aggregate([
          birthdayNexta1,
          birthdayNexta2,
          birthdayNextp1,
          birthdayNexts1
        ]);

      var positiona1 = {
        $addFields: {
          today: {
            $dateFromParts: {
              year: { $year: today },
              month: { $month: today },
              day: { $dayOfMonth: today }
            }
          },
          birthdayThisYear: {
            $dateFromParts: {
              year: { $year: today },
              month: { $month: "$ngayHetHan" },
              day: { $dayOfMonth: "$ngayHetHan" }
            }
          },
          birthdayNextYear: {
            $dateFromParts: {
              year: { $add: [1, { $year: today }] },
              month: { $month: "$ngayHetHan" },
              day: { $dayOfMonth: "$ngayHetHan" }
            }
          }
        }
      };
      var positiona2 = {
        $addFields: {
          nextBirthday: {
            $cond: [
              { $gte: ["$birthdayThisYear", "$today"] },
              "$birthdayThisYear",
              "$birthdayNextYear"
            ]
          }
        }
      };
      var positionh1 = {
        $match: {
          ngayHetHan: {
            $gte: new Date()
          }
        }
      }
      var positionp1 = {
        $project: {
          name: 1,
          ngayHetHan: 1,
          _id: 1,
          belongToDepartment: 1,
          userId: 1,
          daysTillNextBirthday: {
            $divide: [
              { $subtract: ["$nextBirthday", "$today"] },
              24 * 60 * 60 * 1000 /* milliseconds in a day */
            ]
          },
          _id: 0
        }
      };
      var positions1 = {
        $match: {
          daysTillNextBirthday: {
            $gte: 0,
            $lte: 30
          }
        }
      };
      var positionas2 = {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users"
        }
      }
      let positionNext = await mongoose
        .model("positions")
        .aggregate([
          positiona1,
          positiona2,
          positionh1,
          positionp1,
          positions1,
          positionas2,
        ]);

      let contract = await mongoose.model('contract').find();
      let nearlyExpired = [];
      await contract.map(item => {
        let info = item.detail[item.detail.length - 1];
        
        if (!_.isEmpty(info)) {
          if (moment(info.dateExpired) >= moment() && moment(info.dateExpired) <= moment().set('month', moment().get('month') + 1)) {
            nearlyExpired.push({
              ...item,
              detail: [info]
            })
          }
        }
      })
  
      today.getMonth() + 1
      const salaries = await mongoose.model("salary").aggregate([
        {$addFields: {  "month" : {$month: '$ngayKetThuc'}}},
        {$addFields: {  "year" : {$year: '$ngayKetThuc'}}},
        {$match: { month: { $in: [ today.getMonth() + 1, today.getMonth() + 2, today.getMonth() + 3 ]}, year: today.getFullYear() }}
      ])
      
      return success(res, "Done", {
        birthdayNext,
        positionNext,
        nearlyExpired,
        salaries
      });
    } catch (err) {
      console.log(err);
      return errorProcess(res, err);
    }
  });
}