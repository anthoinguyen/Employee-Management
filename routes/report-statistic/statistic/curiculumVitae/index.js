var mongoose = require('mongoose');
var moment = require('moment');
var xlsx = require('excel4node');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/ly-lich-trich-ngang', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let usersData = await mongoose.model('users').find({}).populate('positionId').exec();
        res.render('report-statistic/report/curiculumVitae', {users: usersData})
    });

    router.get('/ly-lich-trich-ngang/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let now = new Date();
        var wb = new xlsx.Workbook({
            defaultFont: {
                size: 12,
                name: 'Times New Romans',
            },
            dateFormat: 'd/m/yy hh:mm:ss'
        });
        var ws = wb.addWorksheet('Sheet 1');
        // Tạo style
        var styleTitle = wb.createStyle(styles.title);
        var styleHeader = wb.createStyle(styles.header);
        var styleCenter = wb.createStyle(styles.center);
        var styleLeft = wb.createStyle(styles.left);
        var styleBold = wb.createStyle(styles.bold);
        var styleItalic = wb.createStyle(styles.italic);
        var styleBorder = wb.createStyle(styles.border);
        let styleWrap = wb.createStyle(styles.wrapText);
        let styleRotate90 = wb.createStyle(styles.rotate90);
        // Tiêu đề
        ws.cell(1, 1)
            .string('THÀNH ĐOÀN TP. HỒ CHÍ MINH')
        ws.cell(2, 1)
            .string('TRƯỜNG ĐOÀN LÝ TỰ TRỌNG')
            .style(styleBold);
        ws.cell(3, 3)
            .string('DANH SÁCH LÝ LỊCH TRÍCH NGANG')
            .style(styleTitle);
        // Header
        ws.cell(5, 1, 6, 1, true).string('STT').style(styleHeader);
        ws.column(1).setWidth(4);
        ws.cell(5, 2, 6, 2, true).string('Họ và tên').style(styleHeader);
        ws.column(2).setWidth(20);
        ws.cell(5, 3, 5, 4, true).string('Ngày, tháng, năm sinh').style(styleHeader).style(styleWrap);
        ws.cell(6, 3).string('Nam').style(styleHeader);
        ws.cell(6, 4).string('Nữ').style(styleHeader);
        ws.cell(5, 5, 6, 5, true).string('Số CMND').style(styleHeader).style(styleWrap);
        ws.cell(5, 6, 6, 6, true).string('Số sổ BHYT').style(styleHeader).style(styleWrap);
        ws.cell(5, 7, 6, 7, true).string('Chức vụ/Chức danh').style(styleHeader).style(styleWrap);
        ws.cell(5, 8, 6, 8, true).string('Đơn vị công tác').style(styleHeader).style(styleWrap);
        ws.cell(5, 9, 6, 9, true).string('Dân tộc').style(styleHeader).style(styleWrap);
        ws.cell(5, 10, 6, 10, true).string('Tôn giáo').style(styleHeader).style(styleWrap);
        ws.cell(5, 11, 6, 11, true).string('Quê quán').style(styleHeader).style(styleWrap);
        ws.column(11).setWidth(30);
        ws.cell(5, 12, 6, 12, true).string('Ngày tháng năm được tuyển dụng').style(styleHeader).style(styleWrap);
        ws.cell(5, 13, 6, 13, true).string('Ngày vào biên chế chính thức (Ngày hưởng ngạch)').style(styleHeader).style(styleWrap);
        ws.cell(5, 14, 6, 14, true).string('Ngày tháng năm vào đơn vị').style(styleHeader).style(styleWrap);
        ws.cell(5, 15, 5, 16, true).string('Ngày vào Đảng').style(styleHeader).style(styleWrap);
        ws.cell(6, 15).string('Dự bị').style(styleHeader);
        ws.cell(6, 16).string('Chính thức').style(styleHeader);
        ws.cell(5, 17, 6, 17, true).string('Trình độ văn hóa').style(styleHeader).style(styleWrap);

        ws.cell(5, 18, 5, 23, true).string('Trình độ chuyên môn').style(styleHeader).style(styleWrap);
        let trinhdo = ['Tiến sĩ', 'Thạc sĩ', 'Đại học', 'Cao đẳng', 'Trung cấp', 'Còn lại'];
        trinhdo.forEach((t, i, ts) => {
            ws.cell(6, 18 + i).string(t).style(styleHeader).style(styleRotate90);
            ws.column(18 + i).setWidth(4)
        });

        ws.cell(5, 24, 6, 24, true).string('Chuyên ngành đào tạo').style(styleHeader).style(styleWrap);

        ws.cell(5, 25, 5, 28, true).string('Trình độ lý luận chính trị').style(styleHeader).style(styleWrap);
        let llct = ['Cử nhân', 'Cao cấp', 'Trung cấp', 'Sơ cấp'];
        llct.forEach((t, i, ts) => {
            ws.cell(6, 25 + i).string(t).style(styleHeader).style(styleRotate90);
            ws.column(25 + i).setWidth(4)
        });

        ws.cell(5, 29, 5, 32, true).string('Trình độ QLNN').style(styleHeader).style(styleWrap);
        let qlnn = ['CV cao cấp', 'CV chính', 'Chuyên viên', 'Cán sự'];
        qlnn.forEach((t, i, ts) => {
            ws.cell(6, 29 + i).string(t).style(styleHeader).style(styleRotate90);
            ws.column(29 + i).setWidth(4)
        });

        ws.cell(5, 33, 6, 33, true).string('Trình độ ngoại ngữ').style(styleHeader).style(styleWrap);
        ws.cell(5, 34, 6, 34, true).string('Trình độ tin học').style(styleHeader).style(styleWrap);

        ws.cell(5, 35, 5, 38, true).string('Lương hiện hưởng').style(styleHeader).style(styleWrap);
        let luong = ['Mã ngạch', 'Bậc', 'Hệ số', 'Thời điểm hưởng'];
        luong.forEach((t, i, ts) => {
            ws.cell(6, 35 + i).string(t).style(styleHeader).style(styleRotate90);
        });


        ws.cell(5, 39, 6, 39, true).string('Ghi chú').style(styleHeader);

        // Đánh số cột
        for (let i = 1; i <= 39; i++) {
            ws.cell(7, i).number(i).style(styleCenter);
        }
        //
        ws.cell(5, 1, 7, 39).style(styleBorder);

        ws.row(6).setHeight(100);

        let r = 8;
        let usersDataGet = await mongoose.model('users').find({'cuuNhanVien': {$ne: true}}).populate('positionId').exec();
        let usersData = await Promise.all(usersDataGet.map(async u=>{
            let salary = await mongoose.model('salary').findOne({user: u._doc._id}).populate('ngach').exec();
            let ngach = '', bac = '', hs = '', thoidiem = '';
            if (salary) {
                if(salary.ngach.maNgach !== undefined) {
                    ngach = salary.ngach.maNgach
                }
                if(salary.bacHeso !== undefined) {
                    bac = salary.bacHeso;
                }
                if(salary.ngach.bacHeso !== undefined) {
                    let heso = salary.ngach.bacHeso;
                    thoidiem = salary.ngach.nam;
                    for (let h of heso) {
                        if(salary.bacHeso === h.bac){
                            hs = h.heso;
                            break;
                        }
                    }
                }
            }
            return {
                ...u._doc,
                maNgach: ngach,
                bac,
                heSo: hs,
                thoidiem,
            };
        }));
        usersData.forEach((user, i, users) => {
            let n = r + i;
            let stt = 1 + i;
            ws.cell(n, 1).number(stt).style(styleCenter);
            ws.cell(n, 2).string(user.name).style(styleLeft);

            if(user.birthday) {
                let birthday = moment(user.birthday).utc(7).format('DD/MM/YYYY');
                if(user.gender === true) {
                    ws.cell(n, 3).string(birthday).style({ numberFormat: 'dd/mm/yyyy' }).style(styleLeft);
                } else {
                    ws.cell(n, 4).string(birthday).style({ numberFormat: 'dd/mm/yyyy' }).style(styleLeft);
                }
            }

            // Số CMND
            ws.cell(n, 5).string((user.IDCard.number !== undefined) ? user.IDCard.number : '').style(styleLeft).style(styleWrap);
            // Số BHXH
            ws.cell(n, 6).string((user.socialInsuranceNumber !== undefined) ? user.socialInsuranceNumber : '').style(styleLeft).style(styleWrap);

            // Vị trí làm việc
            let positions = (user.positionId.length > 0) ? user.positionId : [];
            let positions_str = '';
            positions.forEach((p, i, ps) => {
                if(i > 0) {
                    positions_str += ", ";
                }
                positions_str += p.name;
            });
            ws.cell(n, 7).string(positions_str).style(styleLeft).style(styleWrap);
            // Đơn vị công tác
            ws.cell(n, 8).string((user.belongToDepartment.name !== undefined) ? user.belongToDepartment.name : '').style(styleLeft).style(styleWrap);
            // Dân tộc tôn giáo
            ws.cell(n, 9).string((user.nation !== undefined) ? user.nation : '').style(styleLeft);
            ws.cell(n, 10).string((user.religion !== undefined) ? user.religion : '').style(styleLeft);
            // Quê quán
            if(user.hometown !== undefined) {
                let commune = (user.hometown.commune !== undefined) ? user.hometown.commune :'';
                let district = (user.hometown.district !== undefined) ? ", " + user.hometown.district :'';
                let province = (user.hometown.province !== undefined) ? ", " + user.hometown.province :'';
                let hometown_str = commune + district + province;
                ws.cell(n, 11).string(hometown_str).style(styleLeft).style(styleWrap);
            }
            //
            if(user.recruitmentDay !== undefined)
            {
                let recruitmentDay = moment(user.recruitmentDay).utc(7).format('DD/MM/YYYY');
                ws.cell(n, 12).string(recruitmentDay).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
            }
            // Ngày vào biên chế
            if(user.positionId.length > 0) {
                let bienche = moment(user.positionId[0].ngayBoNhiem).utc(7).format('DD/MM/YYYY');
                ws.cell(n, 13).string(bienche).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
            }
            // Ngày vào đơn vị
            if(user.positionId.length > 0) {
                let vaodonvi = moment(user.positionId[user.positionId.length - 1].ngayBoNhiem).utc(7).format('DD/MM/YYYY');
                ws.cell(n, 14).string(vaodonvi).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
            }
            // Vào Đảng
            if(user.communist) {
                if(user.communist.dateIn) {
                    let dateIn = moment(user.communist.dateIn).utc(7).format('DD/MM/YYYY');
                    if(dateIn) ws.cell(n, 15).string(dateIn).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
                }
                if(user.communist.officalDate) {
                    let officalDate = moment(user.communist.officalDate).utc(7).format('DD/MM/YYYY');
                    if (officalDate) ws.cell(n, 16).string(officalDate).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
                }
            }
            // Văn hóa
            if(user.educationLevel.generalEducationLevel.whichClass !== undefined) {
                ws.cell(n, 17).string(user.educationLevel.generalEducationLevel.whichClass).style(styleCenter);
            }
            // Trình độ chuyên môn
            if(user.educationLevel.highestProfessionalQualification !== undefined) {
                let tdcm = user.educationLevel.highestProfessionalQualification;
                for (let [i,t] of trinhdo.entries()) {
                    if(tdcm === t) {
                        ws.cell(n, 18 + i).string("x").style(styleCenter);
                        break;
                    }
                }
            }
            // Trình độ LLCT
            if(user.educationLevel.politicalTheory !== undefined) {
                let llct_str = user.educationLevel.politicalTheory;
                for (let [i,t] of llct.entries()) {
                    if(llct_str === t) {
                        ws.cell(n, 25 + i).string("x").style(styleCenter);
                        break;
                    }
                }
            }
            // Trình độ QLNN
            if(user.educationLevel.stateManagement !== undefined) {
                let qlnn_str = user.educationLevel.stateManagement;
                for (let [i,t] of qlnn.entries()) {
                    if(qlnn_str === t) {
                        ws.cell(n, 29 + i).string("x").style(styleCenter);
                        break;
                    }
                }
            }
            // Ngoại ngữ, tin học
            if(user.educationLevel.languageLevel !== undefined) {
                ws.cell(n, 33).string(user.educationLevel.languageLevel.description).style(styleCenter);
            }
            if(user.educationLevel.computerSkill !== undefined) {
                ws.cell(n, 34).string(user.educationLevel.computerSkill.description).style(styleCenter);
            }
            // Lương
            ws.cell(n, 35).string(user.maNgach).style(styleCenter);
            ws.cell(n, 36).string(user.bac.toString()).style(styleCenter);
            ws.cell(n, 37).string(user.heSo).style(styleCenter);
            ws.cell(n, 38).string(user.thoidiem.toString()).style(styleCenter);


            // Tạo border
            ws.cell(n, 1, n, 39).style(styleBorder);
        });
        // Ký tên
        let row_sig = r + usersData.length + 1;
        ws.cell(row_sig + 1, 2).string("NGƯỜI LẬP BIỂU").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2, 2).string("(Ghi rõ họ tên)").style(styleCenter).style(styleItalic);
        let ntn = "ngày "+now.getDate()+", tháng "+(now.getMonth()+1)+", năm" + now.getFullYear();
        ws.cell(row_sig , 6).string("............., "+ntn).style(styleCenter).style(styleItalic);
        ws.cell(row_sig + 1 , 6).string("THỦ TRƯỞNG ĐƠN VỊ").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2 , 6).string("(Ký tên, đóng dấu, ghi rõ họ tên)").style(styleCenter).style(styleItalic);
        // Xuất file
        time = now.getDate()+"-"+(now.getMonth()+1)+"-"+now.getFullYear();
        wb.write('ds-ly-lich-trich-ngang_'+time+'.xlsx', res);
    });

};