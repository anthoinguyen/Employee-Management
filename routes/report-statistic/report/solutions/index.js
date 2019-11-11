let mongoose = require('mongoose');
let xlsx = require('excel4node');
let moment = require('moment');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/giai-phap-sang-kien', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let solutions = await mongoose.model('solution').find({}).populate('user', constants.USER_POPULATE).exec();
        return returnToUser.success(res, '', solutions);
    });



    router.get('/giai-phap-sang-kien/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
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
        let styleWrapText = wb.createStyle(styles.wrapText);
        // Tiêu đề
        ws.cell(1, 1)
            .string('THÀNH ĐOÀN TP. HỒ CHÍ MINH')
        ws.cell(2, 1)
            .string('TRƯỜNG ĐOÀN LÝ TỰ TRỌNG')
            .style(styleBold);
        ws.cell(3, 3)
            .string('BÁO CÁO SÁNG KIẾN KINH NGHIỆM')
            .style(styleTitle);
        let time_str = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
        ws.cell(4, 4)
            .string('Tính đến ngày '+ time_str).style(styleItalic);
        // Header
        let h1 = 6;
        let content = 7;
        ws.cell(h1, 1).string('STT').style(styleHeader);
        ws.column(1).setWidth(4);
        ws.cell(h1, 2).string('Họ tên').style(styleHeader);
        ws.column(2).setWidth(25);
        ws.cell(h1, 3).string('Đơn vị công tác').style(styleHeader);
        ws.column(3).setWidth(25);
        ws.cell(h1, 4).string('Đề tài sáng kiến kinh nghiệm').style(styleHeader);
        ws.column(4).setWidth(30);
        ws.cell(h1, 5).string('Loại đề tài').style(styleHeader);
        ws.column(5).setWidth(20);
        ws.cell(h1, 6).string('Xếp loại').style(styleHeader);
        ws.cell(h1, 7).string('Năm').style(styleHeader);
        ws.cell(h1, 8).string('Cấp').style(styleHeader);
        ws.cell(h1, 1, h1, 8).style(styleBorder);
        //
        let solutions = await mongoose.model('solution').find({'confirmed': true}).populate('user', constants.USER_POPULATE).exec();
        await solutions.forEach((solution, index, solutions) => {
            let user = solution.user;
            let row = content + index;
            ws.cell(row, 1).number(index + 1).style(styleCenter);
            ws.cell(row, 2).string(user.name).style(styleLeft);
            ws.cell(row, 3).string((user.belongToDepartment.name) ? user.belongToDepartment.name : '').style(styleLeft).style(styleWrapText);
            ws.cell(row, 4).string((solution.ten) ? solution.ten : '').style(styleLeft).style(styleWrapText);
            ws.cell(row, 5).string((solution.loai) ? solution.loai : '').style(styleCenter);
            ws.cell(row, 6).string((solution.xepLoai) ? solution.xepLoai : '').style(styleCenter);
            ws.cell(row, 7).string((solution.nam) ? solution.nam : '').style(styleCenter);
            ws.cell(row, 8).string((solution.cap) ? solution.cap : '').style(styleCenter);
            ws.cell(row, 1, row, 8).style(styleBorder);
        });


        // Ký tên
        let row_sig = content + solutions.length + 1;
        ws.cell(row_sig + 1, 2).string("NGƯỜI LẬP BIỂU").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2, 2).string("(Ghi rõ họ tên)").style(styleCenter).style(styleItalic);
        let ntn = "ngày "+now.getDate()+", tháng "+(now.getMonth()+1)+", năm" + now.getFullYear();
        ws.cell(row_sig , 6).string("............., "+ntn).style(styleCenter).style(styleItalic);
        ws.cell(row_sig + 1 , 6).string("THỦ TRƯỞNG ĐƠN VỊ").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2 , 6).string("(Ký tên, đóng dấu, ghi rõ họ tên)").style(styleCenter).style(styleItalic);


        // Xuất file
        let time_file_name = now.getDate()+"-"+(now.getMonth()+1)+"-"+now.getFullYear();
        wb.write('sang-kien-kinh-nghiem_'+time_file_name+'.xlsx', res);
    });

};
