let mongoose = require('mongoose');
let xlsx = require('excel4node');
let moment = require('moment');
let returnToUser = require('../../../services/returnToUsers');
let {checkPermission} = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
let styles = require('../../report-statistic/xlsx-styles');

module.exports = router => {
    router.get('/ngay-nghi/:user_id/export/:year', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        const user_id = req.params.user_id;
        const year = req.params.year;
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
            .string('')
            .style(styleBold);
        ws.cell(3, 3)
            .string('BÁO CÁO NGÀY NGHỈ CỦA NHÂN VIÊN')
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
        ws.cell(h1, 4).string('Ngày nghỉ').style(styleHeader);
        ws.column(4).setWidth(30);
        ws.cell(h1, 5).string('Trạng thái').style(styleHeader);
        ws.column(5).setWidth(20);
        ws.cell(h1, 6).string('Lý do').style(styleHeader);
        ws.cell(h1, 1, h1, 8).style(styleBorder);
        //
        let solutions = await mongoose.model('absence').find({userId: user_id}).exec();
        await solutions[0].detail.map((item, index) => {
            if (item.year == year) {
            item.absenceDetail.map((item1, index1) => {
            let row = content + index1;
            ws.cell(row, 1).number(index1 + 1).style(styleCenter);
            ws.cell(row, 2).string(solutions[0].name).style(styleLeft);
            ws.cell(row, 3).string((solutions[0].departmentName) ? solutions[0].departmentName : '').style(styleLeft).style(styleWrapText);
            ws.cell(row, 4).date((item1.date) ? (item1.date) : '').style({ numberFormat: 'dd/mm/yyyy' }).style(styleLeft);
            ws.cell(row, 5).string((item1.isApprove===true) ? "Có Phép" : "Không Phép").style(styleCenter);
            ws.cell(row, 6).string((item1.reason) ? item1.reason : '').style(styleCenter);
            ws.cell(row, 1, row, 8).style(styleBorder);
            })
          }
        });

        // // Ký tên
        // let row_sig = content + chieudai + 1;
        // ws.cell(row_sig + 1, 2).string("NGƯỜI LẬP BIỂU").style(styleCenter).style(styleBold);
        // ws.cell(row_sig + 2, 2).string("(Ghi rõ họ tên)").style(styleCenter).style(styleItalic);
        // let ntn = "ngày "+now.getDate()+", tháng "+(now.getMonth()+1)+", năm" + now.getFullYear();
        // ws.cell(row_sig , 6).string("............., "+ntn).style(styleCenter).style(styleItalic);
        // ws.cell(row_sig + 1 , 6).string("THỦ TRƯỞNG ĐƠN VỊ").style(styleCenter).style(styleBold);
        // ws.cell(row_sig + 2 , 6).string("(Ký tên, đóng dấu, ghi rõ họ tên)").style(styleCenter).style(styleItalic);


        // Xuất file
        let time_file_name = now.getDate()+"-"+(now.getMonth()+1)+"-"+now.getFullYear();
        wb.write('danh-sach-ngay-nghi-nhan-vien-nam'+year+'.xlsx', res);
     });

};
