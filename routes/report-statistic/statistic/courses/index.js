var mongoose = require('mongoose');
var moment = require('moment');
var xlsx = require('excel4node');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/dao-tao-boi-duong', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let courses = await mongoose.model('courses').find({'confirmed': true}).populate('users', constants.USER_POPULATE).exec();
        return returnToUser.success(res, '', courses);
    });

    router.get('/dao-tao-boi-duong/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
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
        // Tiêu đề
        ws.cell(1, 1)
            .string('THÀNH ĐOÀN TP. HỒ CHÍ MINH')
        ws.cell(2, 1)
            .string('TRƯỜNG ĐOÀN LÝ TỰ TRỌNG')
            .style(styleBold);
        ws.cell(3, 3)
            .string('DANH SÁCH CÁN BỘ VIÊN CHỨC ĐANG THAM GIA CÁC KHÓA ĐÀO TẠO, BỒI DƯỠNG')
            .style(styleTitle);
        // Header
        ws.cell(5, 1).string('STT').style(styleHeader).style(styleWrap);
        ws.column(1).setWidth(5);
        ws.cell(5, 2).string('Đơn vị').style(styleHeader).style(styleWrap);
        ws.column(2).setWidth(15);
        ws.cell(5, 3).string('Họ và tên').style(styleHeader).style(styleWrap);
        ws.column(3).setWidth(20);
        ws.cell(5, 4).string('Ngày sinh').style(styleHeader).style(styleWrap);
        ws.cell(5, 5).string('Ngày nhập học').style(styleHeader).style(styleWrap);
        ws.cell(5, 5).string('Ngày nhập học').style(styleHeader).style(styleWrap);
        ws.cell(5, 6).string('Trình độ đào tạo').style(styleHeader).style(styleWrap);
        ws.column(6).setWidth(30);
        ws.cell(5, 7).string('Nội dung đào tạo, bồi dưỡng').style(styleHeader).style(styleWrap);
        ws.column(7).setWidth(30);
        ws.cell(5, 8).string('Hình thức đào tạo, bồi dưỡng').style(styleHeader).style(styleWrap);
        ws.column(8).setWidth(30);
        ws.cell(5, 9).string('Nơi đào tạo, bồi dưỡng').style(styleHeader).style(styleWrap);
        ws.column(9).setWidth(30);

        ws.cell(5, 1, 5, 9).style(styleBorder);

        ws.row(5).setHeight(30);

        let r = 6;
        let stt = 1;
        let courses = await mongoose.model('courses').find({}).populate('user', constants.USER_POPULATE).exec();
        courses.forEach(async (course, i, courses) => {
            let user = course.user;
            n = r + stt - 1;
            ws.cell(n, 1).number(stt).style(styleCenter);
            ws.cell(n, 2).string(user.belongToDepartment.name).style(styleLeft).style(styleWrap);
            ws.cell(n, 3).string(user.name).style(styleLeft).style(styleWrap);
            if(user.birthday) {
                let birthday = moment(user.birthday).utc(7).format('DD/MM/YYYY');
                ws.cell(n, 4).string(birthday).style({ numberFormat: 'dd/mm/yyyy' }).style(styleLeft);
            }

            if(course.ngayBatDau) {
                // let start_date = moment(course.ngayBatDau).format('DD/MM/YYYY');
                ws.cell(n, 5).string(course.ngayBatDau).style({ numberFormat: 'dd/mm/yyyy' }).style(styleLeft);
            }

            // let end_date = new Date(course.ngayKetThuc);
            // ws.cell(n, 6).date(end_date).style({ numberFormat: 'dd/mm/yyyy' }).style(styleLeft);
            ws.cell(n, 6).string(course.trinhDo).style(styleLeft).style(styleWrap);
            ws.cell(n, 7).string(course.noiDung).style(styleLeft).style(styleWrap);
            ws.cell(n, 8).string(course.hinhThuc).style(styleLeft).style(styleWrap);
            ws.cell(n, 9).string(course.diaDiem).style(styleLeft).style(styleWrap);

            ws.cell(n, 1, n, 9).style(styleBorder);
            stt++;
        });
        // Ký tên
        let row_sig = r + courses.length + 1;
        ws.cell(row_sig + 1, 2).string("NGƯỜI LẬP BIỂU").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2, 2).string("(Ghi rõ họ tên)").style(styleCenter).style(styleItalic);
        let ntn = "ngày "+now.getDate()+", tháng "+(now.getMonth()+1)+", năm" + now.getFullYear();
        ws.cell(row_sig , 6).string("............., "+ntn).style(styleCenter).style(styleItalic);
        ws.cell(row_sig + 1 , 6).string("THỦ TRƯỞNG ĐƠN VỊ").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2 , 6).string("(Ký tên, đóng dấu, ghi rõ họ tên)").style(styleCenter).style(styleItalic);
        // Xuất file
        time = now.getDate()+"-"+(now.getMonth()+1)+"-"+now.getFullYear();
        wb.write('ds-dao-tao-boi-duong_'+time+'.xlsx', res);
    });

};