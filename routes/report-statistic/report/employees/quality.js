let mongoose = require('mongoose');
let xlsx = require('excel4node');
let moment = require('moment');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/nhan-vien/so-luong-chat-luong', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        return returnToUser.success(res, '', null);
    });

    router.get('/nhan-vien/so-luong-chat-luong/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
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
        let styleRotate90 = wb.createStyle(styles.rotate90);
        let styleWrap = wb.createStyle(styles.wrapText);
        // Tiêu đề
        ws.cell(1, 1)
            .string('THÀNH ĐOÀN TP. HỒ CHÍ MINH')
        ws.cell(2, 1)
            .string('TRƯỜNG ĐOÀN LÝ TỰ TRỌNG')
            .style(styleBold);
        ws.cell(3, 3)
            .string('BÁO CÁO SỐ LƯỢNG, CHẤT LƯỢNG VIÊN CHỨC')
            .style(styleTitle);
        let time_str = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
        ws.cell(4, 4)
            .string('Tính đến ngày '+ time_str).style(styleItalic);
        // Header
        let h1 = 6;
        let h2 = 7;
        let h3 = 8;
        let h4 = 9;
        let h5 = 10;
        // Đánh thứ tự
        ws.cell(h5, 1).string('A').style(styleCenter);
        ws.cell(h5, 2).string('B').style(styleCenter);
        for(let i = 3; i <= 40; i++) {
            let z = i - 2;
            ws.cell(h5, i).number(z).style(styleCenter);
        }
        //
        let content = 11;
        ws.row(h1).setHeight(40);
        ws.row(h2).setHeight(40);
        ws.row(h3).setHeight(50);
        ws.row(h4).setHeight(120);
        ws.cell(h1, 1, h4, 1, true).string('Số thứ tự').style(styleHeader).style(styleRotate90);
        ws.column(1).setWidth(4);
        ws.cell(h1, 2, h4, 2, true).string('Họ và tên').style(styleHeader);
        ws.column(2).setWidth(25);
        ws.cell(h1, 3, h4, 3, true).string('Đơn vị công tác').style(styleHeader).style(styleWrap);
        ws.column(3).setWidth(25);

        ws.cell(h1, 4, h4, 4, true).string('Tổng số biên chế được giao').style(styleHeader).style(styleRotate90);
        ws.cell(h1, 5, h4, 5, true).string('Tổng số công chức hiện có').style(styleHeader).style(styleRotate90);

        ws.cell(h1, 6, h1, 9, true).string('Trong đó').style(styleHeader);
        ws.cell(h2, 6, h4, 6, true).string('Nữ').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 7, h4, 7, true).string('Đảng viên').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 8, h4, 8, true).string('Dân tộc thiểu số').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 9, h4, 9, true).string('Tôn giáo').style(styleHeader).style(styleRotate90);

        ws.cell(h1, 10, h1, 14, true).string('Chia theo ngạch công chức').style(styleHeader).style(styleWrap);
        ws.cell(h2, 10, h4, 10, true).string('Chuyên viên cao cấp & TĐ').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 11, h4, 11, true).string('Chuyên viên chính & TĐ').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 12, h4, 12, true).string('Chuyên viên và tương đương').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 13, h4, 13, true).string('Cán sự và tương đương').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 14, h4, 14, true).string('Nhân viên').style(styleHeader).style(styleRotate90);

        ws.cell(h1, 15, h1, 33, true).string('Trình độ đào tạo chia theo').style(styleHeader).style(styleWrap);
        ws.cell(h2, 15, h2, 20, true).string('Chuyên môn').style(styleHeader).style(styleWrap);
        ws.cell(h2, 21, h2, 24, true).string('Chính trị').style(styleHeader).style(styleWrap);
        ws.cell(h2, 25, h2, 26, true).string('Tin học').style(styleHeader).style(styleWrap);
        ws.cell(h2, 27, h2, 30, true).string('Ngoại ngữ').style(styleHeader).style(styleWrap);
        ws.cell(h2, 31, h2, 33, true).string('QLNN').style(styleHeader).style(styleWrap);

        let list_chuyenmon = ['Tiến sĩ', 'Thạc sĩ', 'Đại học', 'Cao đẳng', 'Trung cấp', 'Sơ cấp']
        list_chuyenmon.forEach((item, index, list) => {
            let i = 15 + index;
            ws.cell(h3, i, h4, i, true).string(item).style(styleHeader).style(styleRotate90);
        });
        let list_chinhtri = ['Cử nhân', 'Cao cấp', 'Trung cấp', 'Sơ cấp'];
        list_chinhtri.forEach((item, index, list) => {
            let i = 21 + index;
            ws.cell(h3, i, h4, i, true).string(item).style(styleHeader).style(styleRotate90);
        });
        let list_tinhoc = ['Trung cấp trở lên', 'Chứng chỉ'];
        list_tinhoc.forEach((item, index, list) => {
            let i = 25 + index;
            ws.cell(h3, i, h4, i, true).string(item).style(styleHeader).style(styleRotate90);
        });
        let list_ngoaingu = ['Tiếng Anh', 'Ngoại ngữ khác'];
        list_ngoaingu.forEach((item, index, list) => {
            let i = 27 + index*2;
            ws.cell(h3, i, h3, i+1, true).string(item).style(styleHeader).style(styleWrap);
            let sub_list = ['Đại học trở lên', 'Chứng chỉ (A,B,C)'];
            sub_list.forEach((sub_item, sub_index, sub_ll) => {
                let j = i + sub_index;
                ws.cell(h4, j).string(sub_item).style(styleHeader).style(styleRotate90);
            });
        });
        let list_qlnn = ['Chuyên viên cao cấp & TĐ', 'Chuyên viên chính & TĐ', 'Chuyên viên & TĐ'];
        list_qlnn.forEach((item, index, list) => {
            let i = 31 + index;
            ws.cell(h3, i, h4, i, true).string(item).style(styleHeader).style(styleRotate90);
        });

        ws.cell(h1, 34, h1, 40, true).string('Chia theo độ tuổi').style(styleHeader).style(styleWrap);
        ws.cell(h2, 34, h4, 34, true).string('Từ 30 trở xuống').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 35, h4, 35, true).string('Từ 31 đến 40').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 36, h4, 36, true).string('Từ 41 đến 50').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 37, h2, 39, true).string('Từ 51 đến 60').style(styleHeader).style(styleWrap);
        ws.cell(h3, 37, h4, 37, true).string('Tổng số').style(styleHeader).style(styleRotate90);
        ws.cell(h3, 38, h4, 38, true).string('Nữ 51 đến 55').style(styleHeader).style(styleRotate90);
        ws.cell(h3, 39, h4, 39, true).string('Nam 51 đến 60').style(styleHeader).style(styleRotate90);
        ws.cell(h2, 40, h4, 40, true).string('Trên tuổi nghỉ hưu').style(styleHeader).style(styleRotate90);

        let usersDataGet = await mongoose.model('users').find({'cuuNhanVien': false}).exec();
        let usersData = await Promise.all(usersDataGet.map(async u=>{
            let hientai = moment(now).utc(7);
            let tuoi = hientai.diff(u.birthday, 'years');
            return {
                ...u._doc,
                tuoi
            }
        }));
        usersData.forEach((user, i, users) => {
            let stt = i + 1;
            let row = content + i;
            ws.cell(row, 1).number(stt).style(styleCenter);
            let name = (user.name === undefined) ? '' : user.name;
            ws.cell(row, 2).string(name).style(styleCenter);
            let phongban = (user.belongToDepartment.name === undefined) ? '' : user.belongToDepartment.name;
            ws.cell(row, 3).string(phongban).style(styleCenter);
            let gender = (user.gender === false) ? 'X': '';
            if (gender) ws.cell(row, 6).string(gender).style(styleCenter);
            let dangVien = (user.communist.yes) ? 'X' : '';
            if (dangVien) ws.cell(row, 7).string(dangVien).style(styleCenter);
            let danToc = (user.nation !== 'Kinh') ? 'X' : '';
            if (danToc) ws.cell(row, 8).string(danToc).style(styleCenter);
            let tonGiao = (user.religion !== 'Không') ? 'X' : '';
            if (tonGiao) ws.cell(row, 9).string(tonGiao).style(styleCenter);

            // Chuyên môn
            let chuyenMon = (user.educationLevel.highestQualification !== undefined) ? user.educationLevel.highestQualification : '';
            list_chuyenmon.forEach((item, index, list) => {
                let i = 15 + index;
                if(item === chuyenMon) {
                    ws.cell(row, i).string('X').style(styleCenter);
                }
            })
            // Chính trị
            let chinhTri = (user.educationLevel.politicalTheory !== undefined) ? user.educationLevel.politicalTheory : '';
            list_chinhtri.forEach((item, index, list) => {
                let i = 21 + index;
                if(item === chinhTri) {
                    ws.cell(row, i).string('X').style(styleCenter);
                }
            })
            // Tin học
            let tinHoc = (user.educationLevel.computerSkill.level !== undefined) ? user.educationLevel.computerSkill.level : '';
            list_tinhoc = ['Trung cấp trở lên', 'Chứng chỉ']
            list_tinhoc.forEach((item, index, list) => {
                let i = 25 + index;
                if(item === tinHoc) {
                    let str_th = (
                        user.educationLevel.computerSkill.description !== undefined &&
                        user.educationLevel.computerSkill.description !== ''
                    ) ? user.educationLevel.computerSkill.description : 'X';
                    ws.cell(row, i).string(str_th).style(styleCenter);
                }
            });
            // Ngoại ngữ
            let ngoaiNgu = (user.educationLevel.languageLevel.level !== undefined) ? user.educationLevel.languageLevel.level : '';
            list_ngoaingu = ['Tiếng Anh', 'Khác']
            list_ngoaingu.forEach((item, index, list) => {
                let i = 27 + index*2;
                let sub_list = ['Đại học', 'Chứng chỉ'];
                sub_list.forEach((sub_item, sub_index, sub_ll) => {
                    let ngoaiNguLan = (user.educationLevel.languageLevel.language !== undefined) ? user.educationLevel.languageLevel.language : '';
                    if(ngoaiNgu === sub_item && ngoaiNguLan === item) {
                        let j = i + sub_index;
                        let str_nn = (
                            user.educationLevel.languageLevel.description !== undefined &&
                            user.educationLevel.languageLevel.description !== ''
                        ) ? user.educationLevel.languageLevel.description : 'X';
                        ws.cell(row, j).string(str_nn).style(styleCenter);
                    }
                });
            });
            // QLNN
            let qlnn = (user.educationLevel.stateManagement !== undefined) ? user.educationLevel.stateManagement : '';
            list_qlnn = ['Chuyên viên cao cấp', 'Chuyên viên chính', 'Chuyên viên'];
            list_qlnn.forEach((item, index, list) => {
                let i = 31 + index;
                if(qlnn === item) {
                    ws.cell(row, i).string('X').style(styleCenter);
                }
            });
            // Tuổi
            let tuoi = user.tuoi;
            switch (true) {
                case (tuoi <= 30):
                    ws.cell(row, 34).string('X').style(styleCenter);
                    break;
                case (tuoi >= 31 && tuoi <= 40):
                    ws.cell(row, 35).string('X').style(styleCenter);
                    break;
                case (tuoi >= 51 && tuoi <= 55 && user.gender === false):
                    ws.cell(row, 37).string('X').style(styleCenter);
                    ws.cell(row, 38).string('X').style(styleCenter);
                    break;
                case (tuoi >= 51 && tuoi <= 60 && user.gender === true):
                    ws.cell(row, 37).string('X').style(styleCenter);
                    ws.cell(row, 39).string('X').style(styleCenter);
                    break;
                case ((tuoi > 55 && user.gender === false) || (tuoi > 60 && user.gender === true)):
                    ws.cell(row, 40).string('X').style(styleCenter);
                    break;
                default:
                    ws.cell(row, 34).string('X').style(styleCenter);
                    break;
            }
        });

        // Tính tổng, setwidth
        let total = content + usersData.length + 2;
        for(let col = 4; col <= 40; col++) {
            let sum = xlsx.getExcelCellRef(content, col) + ":" + xlsx.getExcelCellRef(total - 1, col);
            ws.cell(total, col).formula('counta('+sum+')').style(styleBold).style(styleCenter);
            ws.column(col).setWidth(4);
        }+

        ws.cell(h1, 1, total, 40).style(styleBorder);

        // Ký tên
        let row_sig = total + 2;
        ws.cell(row_sig + 1, 2).string("NGƯỜI LẬP BIỂU").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2, 2).string("(Ghi rõ họ tên)").style(styleCenter).style(styleItalic);
        let ntn = "ngày "+now.getDate()+", tháng "+(now.getMonth()+1)+", năm" + now.getFullYear();
        ws.cell(row_sig , 6).string("............., "+ntn).style(styleCenter).style(styleItalic);
        ws.cell(row_sig + 1 , 6).string("THỦ TRƯỞNG ĐƠN VỊ").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2 , 6).string("(Ký tên, đóng dấu, ghi rõ họ tên)").style(styleCenter).style(styleItalic);

        // Xuất file
        let time_file_name = now.getDate()+"-"+(now.getMonth()+1)+"-"+now.getFullYear();
        wb.write('so-luong-chat-luong-nhan-vien_'+time_file_name+'.xlsx', res);
    });

};