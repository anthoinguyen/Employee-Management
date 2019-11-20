var mongoose = require("mongoose");

var users = new mongoose.Schema({
  userImage: {
    type: String
  },

  usersCardNumber: {
    type: String
  },

  phoneNumber: {
    type: String
  },

  // typeOfUsers: {
  //   type: String
  // },

  name: {
    required: true,
    type: String
  },

  nickName: {
    type: String
  },

  birthday: {
    type: Date
  },

  gender: {
    type: Boolean //true: Nam, false: Nữ
  },

  placeBirth: {
    commune: { type: String },
    district: { type: String },
    province: { type: String }
  },

  hometown: {
    commune: { type: String },
    district: { type: String },
    province: { type: String }
  },

  nation: {
    type: String
  },

  religion: {
    type: String
  },

  registeredPermResidence: {
    type: String
  },

  registeredTempResidence: {
    type: String
  },

  occupationRecruited: {
    type: String
  },

  recruitmentDay: {
    type: Date
  },

  employmentAgency: {
    type: String
  },

  positionId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "positions",
      autopopulate: true
    }
  ],

  mainJob: {
    type: String
  },

  // scaleOfCivilServant: {
  //   type: String
  // },

  // salaryLevel: {
  //   type: String
  // },

  // scaleCode: {
  //   type: String
  // },

  // coefficient: {
  //   type: String
  // },

  payday: {
    type: Date
  },

  // fringeBenefits: {
  //   type: String
  // },

  // otherFringeBenefits: {
  //   type: String
  // },

  educationLevel: {
    generalEducation: {
      whichClass: { type: String },
      // whichCoefficient: { type: String }
    },

    highestQualification: {
      type: String
    },

    politicalTheory: {
      type: String
    },

    stateManagement: {
      type: String
    },

    languageLevel: {
      language: {
        type: String
      },
      level: {
        type: String
      },
      description: {
        type: String
      }
    },

    computerSkill: {
      level: {
        type: String
      },
      description: {
        type: String
      }
    }
  },

  communist: {
    yes: { type: Boolean },
    number: { type: String },
    dateIn: { type: Date },
    officalDate: { type: Date }
  },

  youthUnion: {
    yes: { type: Boolean },
    dateIn: { type: Date }
  },

  ngayThamGiaToChucCTXH: [
    {
      name: { type: String },
      dateIn: { type: Date },
      mainJob: { type: String }
    }
  ],

  army: {
    dateIn: {
      type: Date
    },
    dateOut: {
      type: Date
    },
    rank: {
      type: String
    },
    highestAward: {
      type: String
    }
  },

  forte: {
    type: String
  },

  health: {
    status: { type: String },
    heigth: { type: String },
    weight: { type: String },
    bloodGroup: { type: String }
  },

  veterans: {
    type: { type: String },
    // date: { type: Date }
  },

  familyPolicy: {
    type: String
  },

  IDCard: {
    number: { type: String },
    dateRange: { type: String }
  },

  socialInsurance: { type: String },

  course: [
    {
      schoolName: { type: String },
      specializedTraining: { type: String },
      fromDate: { type: Date },
      toDate: { type: Date },
      formsOfTraining: { type: String },
      diploma: { type: String }
    }
  ],
  workingProccess: [
    {
      fromDate: { type: Date },
      toDate: { type: Date },
      description: { type: String }
    }
  ],

  personalHistory: [
    {
      question1: { type: String },
      question2: { type: String },
      question3: { type: String }
    }
  ],

  familyRelationship: {
    aboutMyself: [
      {
        type: {
          type: String
        },
        name: {
          type: String
        },
        birthday: { type: Date },
        description: { type: String }
      }
    ],
    aboutOther: [
      {
        type: {
          type: String
        },
        name: {
          type: String
        },
        birthday: { type: Date },
        description: { type: String }
      }
    ]
  },

  wageMovements: [
    {
      date: { type: Date },
      salaryLevel: {
        type: String
      },

      scaleCode: {
        type: String
      },

      coefficient: {
        type: String
      }
    }
  ],

  // laborContract: [
  //   {
  //     scanImage: { type: String },
  //     dateSign: { type: Date },
  //     dateExpired: { type: Date },
  //     description: { type: String }
  //   }
  // ],

  belongToDepartment: {
    name: {
      type: String
    },
    departmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments"
    }
  },
  evaluate: {
    type: String
  },

  email: {
    required: true,
    type: String
  },

  password: {
    required: true,
    type: String
  },

  roles: [
    {
      type: String
    }
  ],

  cuuNhanVien: {
    type: Boolean,
    default: false
  }
});
users.plugin(require("mongoose-autopopulate"));
module.exports = users;
