var mongoose = require('mongoose');
var moment = require('moment');
var xlsx = require('excel4node');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/thong-tin-lien-lac', checkPermission(constants.IS_ADMIN),async (req, res, next) => {
        return returnToUser.success(res, '', null);
    });

    router.get('/thong-tin-lien-lac/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
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
        var styleWrapText = wb.createStyle(styles.wrapText);
        var styleBold = wb.createStyle(styles.bold);
        var styleItalic = wb.createStyle(styles.italic);
        var styleBorder = wb.createStyle(styles.border);
        let styleRotate90 = wb.createStyle(styles.rotate90);
        // Tiêu đề
        ws.cell(1, 1)
            .string('THÀNH ĐOÀN TP. HỒ CHÍ MINH')
        ws.cell(2, 1)
            .string('TRƯỜNG ĐOÀN LÝ TỰ TRỌNG')
            .style(styleBold);
        ws.cell(3, 3)
            .string('DANH SÁCH THÔNG TIN LIÊN LẠC')
            .style(styleTitle);
        // Header
        ws.cell(5, 1, 6, 1, true).string('STT').style(styleHeader);
        ws.column(1).setWidth(5);
        ws.cell(5, 2, 6, 2, true).string('Họ và tên').style(styleHeader);
        ws.column(2).setWidth(25);

        ws.cell(5, 3, 5, 4, true).string('Ngày, tháng, năm sinh').style(styleHeader);
        ws.cell(6, 3).string('Nam').style(styleHeader);
        ws.cell(6, 4).string('Nữ').style(styleHeader);
        ws.cell(5, 5, 6, 5, true).string('Số điện thoại').style(styleHeader).style(styleWrapText);
        ws.cell(5, 6, 6, 6, true).string('Email').style(styleHeader).style(styleWrapText);
        ws.cell(5, 7, 6, 7, true).string('Chức vụ/Chức danh').style(styleHeader).style(styleWrapText);
        ws.cell(5, 8, 6, 8, true).string('Đơn vị công tác').style(styleHeader).style(styleWrapText);
        ws.cell(5, 9, 6, 9, true).string('Nơi sinh').style(styleHeader);
        ws.cell(5, 10, 6, 10, true).string('Quê quán').style(styleHeader);
        ws.cell(5, 11, 6, 11, true).string('Nơi đăng ký hộ khẩu thường trú').style(styleHeader);
        ws.cell(5, 12, 6, 12, true).string('Nơi ở hiện nay').style(styleHeader);

        ws.cell(5, 1, 6, 12).style(styleBorder);
        ws.row(6).setHeight(50);


        let r = 9;
        let usersData = await mongoose.model('users').find({}).sort({name: 1}).exec();
        usersData.forEach(async (user, i, users) => {
            let n = r + i;
            let stt = 1 + i;
            ws.cell(n, 1).number(stt).style(styleCenter);
            ws.cell(n, 2).string(user.name).style(styleLeft);
            if (user.birthday) {
                let birthday = moment(user.birthday).utc(7).format('DD/MM/YYYY');
                if(user.gender === true) {
                    ws.cell(n, 3).string(birthday).style({ numberFormat: 'dd/mm/yyyy' }).style(styleLeft);
                } else {
                    ws.cell(n, 4).string(birthday).style({ numberFormat: 'dd/mm/yyyy' }).style(styleLeft);
                }
            }
            // Số điện thoại
            ws.cell(n, 5).string((user.phoneNumber !== undefined) ? user.phoneNumber : '').style(styleLeft).style(styleWrapText);
            // Email
            ws.cell(n, 6).string((user.email !== undefined) ? user.email : '').style(styleLeft).style(styleWrapText);
            ws.column(6).setWidth(20);
            // Vị trí làm việc
            let positions = user.positionId;
            let positions_str = '';
            if(positions.length > 0) {
                positions_str = positions[positions.length - 1].name;
            }
            ws.cell(n, 7).string(positions_str).style(styleLeft).style(styleWrapText);
            // Đơn vị công tác
            if(user.belongToDepartment.name !== undefined) {
                ws.cell(n, 8).string(user.belongToDepartment.name).style(styleLeft).style(styleWrapText);
            }
            // Nơi sinh
            let placeBirth = (user.placeBirth.province !== undefined) ? user.placeBirth.province : '';
            ws.cell(n, 9).string(placeBirth).style(styleLeft).style(styleWrapText);
            // Quê quán
            let hometown_str = ((user.hometown.commune !== undefined) ? user.hometown.commune : '')
                + ((user.hometown.district !== undefined) ? ', ' + user.hometown.district : '')
                + ((user.hometown.province !== undefined) ? ', ' + user.hometown.province : '');

            ws.cell(n, 10).string(hometown_str).style(styleLeft).style(styleWrapText);
            ws.column(10).setWidth(30);
            // Thường trú, tạm trú
            if(user.registeredPermResidence !== undefined)
                ws.cell(n, 11).string(user.registeredPermResidence).style(styleLeft).style(styleWrapText);
            if(user.registeredTempResidence !== undefined)
                ws.cell(n, 12).string(user.registeredTempResidence).style(styleLeft).style(styleWrapText);
            ws.column(11).setWidth(30);
            ws.column(12).setWidth(30);
            
            // Tạo border
            ws.cell(n, 1, n, 12).style(styleBorder);

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
        wb.write('ds-thong-tin-lien-lac_'+time+'.xlsx', res);
    });

};