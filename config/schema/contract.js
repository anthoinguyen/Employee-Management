var mongoose = require("mongoose");
var constants = require("../../routes/constants");

var contract = new mongoose.Schema({
  usersId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  
  name: {
    required: true,
    type: String
  },

  usersCardNumber: {
    type: String
  },

  typeOfUsers: {
    type: String
  },

  departmentName: {
    type: String
  },

  detail: [
    {
      daySigned: {
        type: Date
      },
      dateExpired: {
        type: Date
      },
      scanImage: [
        {
          type: String
        }
      ],
      positionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "positions"
      },
      fileLink: {
        type: String
      },
      signedBy: {
        type: String
      },
      typeOfContract: {
        type: String,
        enum: constants.CONTRACT_TYPE_OF
      },
      contractTerm: {
        type: String,
        enum: constants.CONTRACT_TERM
      },
      note: {
        type: String
      },
      contractIdNumber: {
        type: String
      },
      beginEnd: {
        type: Boolean,
        default: false
      }
    }
  ]
});

contract.index({ usersId: 1 });

module.exports = contract;
