var mongoose = require('mongoose');
var xlsx = require('excel4node');
var moment = require('moment')
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/hop-dong', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let constracts = await mongoose.model('contract').find({}).populate('usersId').sort({typeOfUsers: 1}).exec();
        return returnToUser.success(res, '', constracts);
    });

    router.get('/hop-dong/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
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
        var styleItalic = wb.createStyle(styles.italic);
        var styleCenter = wb.createStyle(styles.center);
        var styleLeft = wb.createStyle(styles.left);
        var styleWrapText = wb.createStyle(styles.wrapText);
        var styleBold = wb.createStyle(styles.bold);
        var styleBorder = wb.createStyle(styles.border);
        // Tiêu đề
        ws.cell(1, 1)
            .string('THÀNH ĐOÀN TP. HỒ CHÍ MINH')
        ws.cell(2, 1)
            .string('TRƯỜNG ĐOÀN LÝ TỰ TRỌNG')
            .style(styleBold);
        ws.cell(3, 3)
            .string('DANH SÁCH HỢP ĐỒNG LAO ĐỘNG')
            .style(styleTitle);
        // Header
        ws.cell(5, 1, 6, 1, true).string('STT').style(styleHeader);
        ws.cell(5, 2, 6, 2, true).string('Họ và tên').style(styleHeader);
        ws.cell(5, 3, 5, 4, true).string('Ngày, tháng, năm sinh').style(styleHeader);
        ws.cell(6, 3).string('Nam').style(styleHeader);
        ws.cell(6, 4).string('Nữ').style(styleHeader);
        ws.cell(5, 5, 6, 5, true).string('Đơn vị công tác').style(styleHeader);
        ws.cell(5, 6, 6, 6, true).string('Loại hợp đồng').style(styleHeader);
        ws.cell(5, 7, 6, 7, true).string('Ngày ký').style(styleHeader);
        ws.cell(5, 8, 6, 8, true).string('Ngày hết hạn').style(styleHeader);

        ws.cell(5, 1, 6, 8).style(styleBorder);

        let r = 7;
        let constracts = await mongoose.model('contract').find({}).populate('usersId').sort({typeOfUsers: 1}).exec();
        let i = 0;
        constracts.forEach((constract, index, constracts) => {
            let n = r + i;
            let stt = 1 + i;
            if(constract.usersId && constract.detail.length > 0) {
                ws.cell(n, 1).number(stt).style(styleCenter);
                ws.column(1).setWidth(5);
                ws.cell(n, 2).string(constract.usersId.name).style(styleLeft);
                if (constract.usersId.birthday) {
                    let birthday = moment(constract.usersId.birthday).utc(7).format('DD/MM/YYYY');
                    if(constract.usersId.gender === true) {
                        ws.cell(n, 3).string(birthday).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
                    } else {
                        ws.cell(n, 4).string(birthday).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
                    }
                }
                ws.column(2).setWidth(25);

                // Đơn vị công tác
                ws.cell(n, 5).string((constract.departmentName !== undefined) ? constract.departmentName : '').style(styleLeft);
                ws.column(5).setWidth(20);
                // Loại hợp đồng
                let lhd = constract.detail[constract.detail.length - 1].typeOfContract;
                ws.cell(n, 6).string(lhd).style(styleLeft);
                ws.column(6).setWidth(20);
                // Ngày ký
                let last_renew = constract.detail.length - 1;
                if(last_renew >= 0) {
                    let daySigned = moment(constract.detail[last_renew].daySigned).utc(7).format('DD/MM/YYYY');
                    ws.cell(n, 7).string(daySigned).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
                    if (constract.detail[last_renew].dateExpired) {
                        let dateExpired = moment(constract.detail[last_renew].dateExpired).utc(7).format('DD/MM/YYYY');
                        ws.cell(n, 8).string(dateExpired).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
                    } else {
                        ws.cell(n, 8).string('Vô thời hạn').style(styleLeft);
                    }
                }
                // Tạo border
                ws.cell(n, 1, n, 8).style(styleBorder);
                i++;
            }
        });
        // Ký tên
        let row_sig = r + constracts.length + 1;
        ws.cell(row_sig + 1, 2).string("NGƯỜI LẬP BIỂU").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2, 2).string("(Ghi rõ họ tên)").style(styleCenter).style(styleItalic);
        let ntn = "ngày "+now.getDate()+", tháng "+(now.getMonth()+1)+", năm" + now.getFullYear();
        ws.cell(row_sig , 6).string("............., "+ntn).style(styleCenter).style(styleItalic);
        ws.cell(row_sig + 1 , 6).string("THỦ TRƯỞNG ĐƠN VỊ").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2 , 6).string("(Ký tên, đóng dấu, ghi rõ họ tên)").style(styleCenter).style(styleItalic);

        // Xuất file
        time = now.getDate()+"-"+(now.getMonth()+1)+"-"+now.getFullYear();
        wb.write('ds-hop-dong_'+time+'.xlsx', res);
    });

};