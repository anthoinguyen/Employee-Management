let mongoose = require('mongoose');
let xlsx = require('excel4node');
let moment = require('moment');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/nhan-vien/tham-nien', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        data = null

        return returnToUser.success(res, '', data);
    });

    router.get('/nhan-vien/tham-nien/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
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
            .string('BÁO CÁO THÂM NIÊN CÔNG TÁC')
            .style(styleTitle);
        let time_str = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
        ws.cell(4, 4)
            .string('Tính đến ngày '+ time_str).style(styleItalic);
        // Header
        let h1 = 6;
        let content = 7;
        ws.cell(h1, 1).string('STT').style(styleHeader);
        ws.column(1).setWidth(4);
        ws.cell(h1, 2).string('Họ và tên').style(styleHeader);
        ws.column(2).setWidth(25);
        ws.cell(h1, 3).string('Chức vụ/Chức danh').style(styleHeader).style(styleWrap);
        ws.column(3).setWidth(25);
        ws.cell(h1, 4).string('Đơn vị công tác').style(styleHeader).style(styleWrap);
        ws.column(4).setWidth(25);
        ws.cell(h1, 5).string('Ngày tháng năm vào đơn vị').style(styleHeader).style(styleWrap);
        ws.column(5).setWidth(25);
        ws.cell(h1, 6).string('Thâm niên công tác').style(styleHeader).style(styleWrap);


        let users = await mongoose.model('users').find({'cuuNhanVien': {$ne: true}}).exec();
        let i = 0;
        users.forEach((u,index,us) =>{
            let row = content + i;
            ws.cell(row, 1).number(i + 1).style(styleCenter);
            ws.cell(row, 2).string(u.name).style(styleLeft);
            if(u.positionId.length > 0)
            {
                let posi = u.positionId[u.positionId.length - 1] ? u.positionId[u.positionId.length - 1] : '';
                ws.cell(row, 3).string(posi.name).style(styleLeft);
            }

            let department = u.belongToDepartment.name ? u.belongToDepartment.name : '';
            if(department) {
                ws.cell(row, 4).string(department).style(styleLeft);
            }

            if (u.recruitmentDay) {
                let ngayBoNhiem = moment(u.recruitmentDay).utc(7).format('DD/MM/YYYY');
                ws.cell(row, 5).string(ngayBoNhiem).style({ numberFormat: 'dd/mm/yyyy' }).style(styleLeft);
            }

            let hientai = moment(now).utc(7);
            let thamNien = hientai.diff(u.recruitmentDay, 'years');
            if(thamNien % 5 === 0 && thamNien > 0) {
                ws.cell(row, 6).number(thamNien).style(styleBold).style(styleCenter);
            } else {
                ws.cell(row, 6).number(thamNien).style(styleCenter);
            }
            i++;
        });

        ws.cell(h1, 1, content + i, 6).style(styleBorder);

        // Ký tên
        let row_sig = content + i + 2;
        ws.cell(row_sig + 1, 2).string("NGƯỜI LẬP BIỂU").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2, 2).string("(Ghi rõ họ tên)").style(styleCenter).style(styleItalic);
        let ntn = "ngày "+now.getDate()+", tháng "+(now.getMonth()+1)+", năm" + now.getFullYear();
        ws.cell(row_sig , 5).string("............., "+ntn).style(styleCenter).style(styleItalic);
        ws.cell(row_sig + 1 , 5).string("THỦ TRƯỞNG ĐƠN VỊ").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2 , 5).string("(Ký tên, đóng dấu, ghi rõ họ tên)").style(styleCenter).style(styleItalic);


        // Xuất file
        let time_file_name = now.getDate()+"-"+(now.getMonth()+1)+"-"+now.getFullYear();
        wb.write('tham-nien-cong-tac-nhan-vien_'+time_file_name+'.xlsx', res);
    });

};
