var mongoose = require("mongoose");

var users = new mongoose.Schema({
  userImage: {
    type: String
  },

  usersCardNumber: {
    // Số hiệu cán bộ
    type: String
  },

  phoneNumber: {
    // Số điện thoại
    type: String
  },

  typeOfUsers: {
    // Loại cán bộ
    type: String
  },

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
  // Nơi sinh
  placeBirth: {
    commune: { type: String },
    district: { type: String },
    province: { type: String }
  },
  // Quê quán
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

  registeredPermanentResidence: {
    //nơi đăng ký hộ khẩu thường trú
    type: String
  },

  registeredTemporaryResidence: {
    //nơi đăng ký tạm trú or nơi ở hiện tại
    type: String
  },

  occupationƯwhenRecruited: {
    //nghề nghiệp khi được tuyển dụng
    type: String
  },

  recruitmentDay: {
    //ngày tuyển dụng
    type: Date
  },

  employmentAgency: {
    //cơ quan tuyển dụng
    type: String
  },

  positionId: [
    {
      //chức vụ hiện tại
      type: mongoose.Schema.Types.ObjectId,
      ref: "positions",
      autopopulate: true
    }
  ],

  mainJob: {
    //công việc chính được giao
    type: String
  },

  scaleOfCivilServant: {
    //ngạch công chức (viên chức)
    type: String
  },

  salaryLevel: {
    //bậc lương
    type: String
  },

  scaleCode: {
    //mã ngạch
    type: String
  },

  coefficient: {
    //hệ số lương
    type: String
  },

  payday: {
    //ngày trả lương
    type: Date
  },

  fringeBenefits: {
    //phụ cấp chức vụ
    type: String
  },

  otherFringeBenefits: {
    //phụ cấp khác
    type: String
  },

  educationLevel: {
    generalEducationLevel: {
      //trình độ giáo dục phổ thông
      whichClass: { type: String }, //đã tốt nghiệp lớp mấy
      whichCoefficient: { type: String } //thuộc hệ nào
    },

    highestProfessionalQualification: {
      //trình độ chuyên môn cao nhất
      type: String
    },

    politicalTheory: {
      //lý luận chính trị
      type: String
    },

    stateManagement: {
      //quản lý nhà nước
      type: String
    },

    languageLevel: {
      //trình độ ngoại ngữ
      language: {
        // Ngôn ngữ
        type: String
      },
      level: {
        // Trình độ
        type: String
      },
      description: {
        // Mô tả
        type: String
      }
    },

    computerSkill: {
      level: {
        // Trình độ
        type: String
      },
      description: {
        // Mô tả
        type: String
      }
    }
  },

  communist: {
    // Đảng viên
    // Ngày vào
    // Ngày vào chính thức
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
      // Ngày nhập ngũ
      type: Date
    },
    dateOut: {
      // Ngày xuất ngũ
      type: Date
    },
    rank: {
      // Quân hàm
      type: String
    },
    highestAward: {
      // Phong hiệu được phong tặng cao nhất
      type: String
    }
  },

  forte: {
    // Sở trường công tác
    type: String
  },

  health: {
    status: { type: String },
    heigth: { type: String },
    weight: { type: String },
    bloodGroup: { type: String }
  },

  veterans: {
    // Thương binh
    type: { type: String }, // Hạng
    date: { type: Date }
  },
  familyPolicy: {
    type: String
  },

  IDCard: {
    number: { type: String },
    dateRange: { type: String }
  },

  socialInsuranceNumber: { type: String },

  course: [
    {
      // Tên trường, chuyên ngành đào tạo, từ đến, hình thức đào tạo, văn bằng
      schoolName: { type: String }, // Nơi đào tạo
      specializedTraining: { type: String }, // Chuyên ngành đào tạo
      fromDate: { type: Date },
      toDate: { type: Date },
      formsOfTraining: { type: String }, // Hình thức đào tạo
      diploma: { type: String } // Văn bằng, chứng chỉ
    }
  ],
  workingProccess: [
    {
      // Quá trình công tác
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
          // Mối quan hệ
          type: String
        },
        name: {
          // Họ tên
          type: String
        },
        birthday: { type: Date },
        description: { type: String }
      }
    ],
    aboutOther: [
      {
        type: {
          // Mối quan hệ
          type: String
        },
        name: {
          // Họ tên
          type: String
        },
        birthday: { type: Date },
        description: { type: String }
      }
    ]
  },

  wageMovements: [
    {
      // Diễn biến quá trình lương
      date: { type: Date },
      salaryLevel: {
        //bậc lương
        type: String
      },

      scaleCode: {
        //mã ngạch
        type: String
      },

      coefficient: {
        //hệ số lương
        type: String
      }
    }
  ],

  laborContract: [
    {
      scanImage: { type: String },
      dateSign: { type: Date },
      dateExpired: { type: Date },
      description: { type: String }
    }
  ],

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
    // Nhận xét đánh giá của cơ quan đơn vị
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
