let mongoose = require('mongoose');
let xlsx = require('excel4node');
let moment = require('moment');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/tham-nien', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let contracts = await mongoose.model('contract').find({}).exec();
        return returnToUser.success(res, '', contracts);
    });

    router.get('/tham-nien/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
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
        // Tiêu đề
        ws.cell(1, 1)
            .string('THÀNH ĐOÀN TP. HỒ CHÍ MINH')
        ws.cell(2, 1)
            .string('TRƯỜNG ĐOÀN LÝ TỰ TRỌNG')
            .style(styleBold);
        ws.cell(3, 3)
            .string('THỐNG KÊ THÂM NIÊN CÔNG TÁC NHÂN VIÊN')
            .style(styleTitle);
        let time_str = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
        ws.cell(4, 4)
            .string('Tính đến ngày '+ time_str).style(styleItalic);
        // Header
        let h1 = 6;
        let h2 = 7;
        let h3 = 8;
        let content = 9;
        ws.cell(h1, 1, h2, 1, true).string('STT').style(styleHeader);
        ws.column(1).setWidth(5);
        ws.cell(h1, 2, h2, 2, true).string('Chức danh').style(styleHeader);
        ws.column(2).setWidth(20);
        ws.cell(h1, 3, h2, 3, true).string('Tổng số lao động').style(styleHeader);
        ws.column(3).setWidth(20);

        ws.cell(h1, 4, h1, 8, true).string('Thâm niên công tác').style(styleHeader);
        ws.cell(h2, 4).string('Dưới 1 năm').style(styleHeader);
        ws.cell(h2, 5).string('1-2 năm').style(styleHeader);
        ws.cell(h2, 6).string('3-5 năm').style(styleHeader);
        ws.cell(h2, 7).string('6-10 năm').style(styleHeader);
        ws.cell(h2, 8).string('Trên 10 năm').style(styleHeader);

        let postions = await mongoose.model('positions').aggregate([
            {$group: {
                    _id: "$name",
                }}]).exec();
        let users = await mongoose.model('users').find({'cuuNhanVien': {$ne: true}}).exec();
        let new_positions = postions.map((posi, index, posis) =>{
            let y_lt_1 = 0, y_1_2 = 0, y_3_5 = 0, y_6_10 = 0, y_gt_10 = 0, count_all = 0;
            let hientai = moment(now).utc(7);
            users.forEach((u, i, us) =>{
                if(u.recruitmentDay) {
                    count_all++;
                    let thamNien = hientai.diff(u.recruitmentDay, 'years');
                    switch (true) {
                        case (thamNien < 1): y_lt_1 += 1; break;
                        case (thamNien >= 1 && thamNien <= 2): y_1_2 += 1; break;
                        case (thamNien >= 3 && thamNien <= 5): y_3_5 += 1; break;
                        case (thamNien >= 6 && thamNien <= 10): y_6_10 += 1; break;
                        case (thamNien > 10): y_gt_10 += 1; break;
                        default: break;
                    }
                }
            });
            return {
                name: posi._id,
                count_all,
                y_lt_1,
                y_1_2,
                y_3_5,
                y_6_10,
                y_gt_10
            }
        });
        new_positions.forEach((po, i, pos) =>{
            let row = content + i;
            ws.cell(row, 1).number(i + 1);
            ws.cell(row, 2).string(po.name);
            ws.cell(row, 3).number(po.count_all);
            ws.cell(row, 4).number(po.y_lt_1);
            ws.cell(row, 5).number(po.y_1_2);
            ws.cell(row, 6).number(po.y_3_5);
            ws.cell(row, 7).number(po.y_6_10);
            ws.cell(row, 8).number(po.y_gt_10);
        });

        // Tính tổng
        let total = content + new_positions.length + 1;
        let cols_sum = [3,4,5,6,7,8];
        let demo = [];
        for(let col of cols_sum) {
            let sum = xlsx.getExcelCellRef(content, col) + ":" + xlsx.getExcelCellRef(total - 1, col);
            ws.cell(total, col).formula('sum('+sum+')').style(styleBold);
        }

        ws.cell(h1, 1, total, 8).style(styleBorder);

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
        wb.write('tham-nien-cong-tac_'+time_file_name+'.xlsx', res);
    });

};