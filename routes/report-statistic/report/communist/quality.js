let mongoose = require('mongoose');
let xlsx = require('excel4node');
let moment = require('moment');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/dang-vien/chat-luong', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        return returnToUser.success(res, '', null);
    });

    router.get('/dang-vien/chat-luong/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
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
            .string('BÁO CÁO CHẤT LƯỢNG ĐẢNG VIÊN')
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
        ws.column(1).setWidth(4);

        ws.cell(h1, 2, h2, 2, true).string('Chức danh').style(styleHeader);
        ws.cell(h1, 3, h2, 3, true).string('Tổng số lao động').style(styleHeader).style(styleWrap);

        ws.cell(h1, 4, h1, 5, true).string('Số Đảng viên').style(styleHeader);
        ws.cell(h2, 4).string('Tổng số').style(styleHeader).style(styleWrap);
        ws.cell(h2, 5).string('Dân tộc').style(styleHeader).style(styleWrap);

        ws.cell(h1, 6, h1, 10, true).string('Chia theo trình độ chuyên môn').style(styleHeader);
        ws.cell(h2, 6).string('Trên ĐH').style(styleHeader).style(styleWrap);
        ws.cell(h2, 7).string('Đại học').style(styleHeader).style(styleWrap);
        ws.cell(h2, 8).string('Cao đẳng').style(styleHeader).style(styleWrap);
        ws.cell(h2, 9).string('Trung cấp').style(styleHeader).style(styleWrap);
        ws.cell(h2, 10).string('Khác').style(styleHeader).style(styleWrap);

        ws.cell(h1, 11, h1, 15, true).string('Chia theo độ tuổi').style(styleHeader);
        ws.cell(h2, 11).string('Dưới 31').style(styleHeader).style(styleWrap);
        ws.cell(h2, 12).string('31-40').style(styleHeader).style(styleWrap);
        ws.cell(h2, 13).string('41-50').style(styleHeader).style(styleWrap);
        ws.cell(h2, 14).string('51-55').style(styleHeader).style(styleWrap);
        ws.cell(h2, 15).string('Trên 55').style(styleHeader).style(styleWrap);

        ws.cell(h1, 16, h1, 20, true).string('Chia theo tuổi Đảng').style(styleHeader);
        ws.cell(h2, 16).string('Dưới 5 năm').style(styleHeader).style(styleWrap);
        ws.cell(h2, 17).string('5-10 năm').style(styleHeader).style(styleWrap);
        ws.cell(h2, 18).string('11-20 năm').style(styleHeader).style(styleWrap);
        ws.cell(h2, 19).string('21-30 năm').style(styleHeader).style(styleWrap);
        ws.cell(h2, 20).string('Trên 30 năm').style(styleHeader).style(styleWrap);

        for(let ii = 3; ii <= 20; ii++) {
            ws.column(ii).setWidth(7);
        }
        ws.row(h2).setHeight(100);
        let postions = await mongoose.model('positions').aggregate([
            {$group: {
                    _id: "$name",
                }}]).exec();
        let users = await mongoose.model('users').find({"cuuNhanVien": {$ne: true}}).exec();
        let dangviens = await mongoose.model('users').find({"cuuNhanVien": {$ne: true},"communist.yes": {$eq: true} }).exec();
        let new_position = postions.map((posi, index, posis)=>{
            let count_user =0, count_dangVien = 0;
            let dantoc = 0;
            let td_trenDH = 0, td_DH = 0, td_CD = 0, td_TC = 0, td_Khac = 0;
            let tuoi_lt_31 = 0, tuoi_31_40 = 0, tuoi_41_50 = 0, tuoi_51_55 = 0, tuoi_gt_55 = 0;
            let tuoiDang_lt_5 = 0, tuoiDang_5_10 = 0, tuoiDang_11_20 = 0, tuoiDang_21_30 = 0, tuoiDang_gt_30 = 0;
            users.forEach((u,i,us)=>{
                if(u.positionId.length > 0)
                if(u.positionId[u.positionId.length - 1].name === posi._id) {
                    count_user++;
                }
            });
            dangviens.forEach((dv, i, dvs) => {
                if(dv.positionId.length > 0)
                if(dv.positionId[dv.positionId.length - 1].name === posi._id) {
                    count_dangVien++;
                    // Dân tộc
                    if(dv.nation !== 'Kinh') dantoc += 1;
                    // Trình độ chuyên môn
                    let tdcm = dv.educationLevel.highestQualification;
                    switch (tdcm) {
                        case "Tiến sĩ": td_trenDH += 1; break;
                        case "Thạc sĩ": td_trenDH += 1; break;
                        case "Đại học": td_DH += 1; break;
                        case "Cao đẳng": td_CD += 1; break;
                        case "Trung cấp": td_TC += 1; break;
                        default: td_Khac += 1; break;
                    }
                    // Tính tuổi
                    let hientai = moment(now).utc(7);
                    let tuoi = hientai.diff(dv.birthday, 'years');
                    let tuoidang = hientai.diff(dv.communist.dateIn, 'years');
                    switch (true) {
                        case (tuoi < 31): tuoi_lt_31 += 1; break;
                        case (tuoi >= 31 && tuoi <= 40): tuoi_31_40 += 1; break;
                        case (tuoi >= 41 && tuoi <= 50): tuoi_41_50 += 1; break;
                        case (tuoi >= 51 && tuoi <= 55): tuoi_51_55 += 1; break;
                        case (tuoi > 55): tuoi_gt_55 += 1; break;
                        default: break;
                    }
                    switch (true) {
                        case (tuoidang < 5): tuoiDang_lt_5 += 1; break;
                        case (tuoidang >= 5 && tuoidang <= 10): tuoiDang_5_10 += 1; break;
                        case (tuoidang >= 11 && tuoidang <= 20): tuoiDang_11_20 += 1; break;
                        case (tuoidang >= 21 && tuoidang <= 30): tuoiDang_21_30 += 1; break;
                        case (tuoidang > 30): tuoiDang_gt_30 += 1; break;
                        default: break;
                    }
                }
            });
            return {
                name: posi._id,
                count_user,
                count_dangVien,
                dantoc,
                td_trenDH,
                td_DH,
                td_CD,
                td_TC,
                td_Khac,
                tuoi_lt_31,
                tuoi_31_40,
                tuoi_41_50,
                tuoi_51_55,
                tuoi_gt_55,
                tuoiDang_lt_5,
                tuoiDang_5_10,
                tuoiDang_11_20,
                tuoiDang_21_30,
                tuoiDang_gt_30
            }
        });
        new_position.forEach((po, i, pos) =>{
            let row = content + i;
            ws.cell(row, 1).number(i+1).style(styleCenter);
            ws.cell(row, 2).string(po.name).style(styleCenter);
            ws.cell(row, 3).number(po.count_user).style(styleCenter);
            ws.cell(row, 4).number(po.count_dangVien).style(styleCenter);
            ws.cell(row, 5).number(po.dantoc).style(styleCenter);
            ws.cell(row, 6).number(po.td_trenDH).style(styleCenter);
            ws.cell(row, 7).number(po.td_DH).style(styleCenter);
            ws.cell(row, 8).number(po.td_CD).style(styleCenter);
            ws.cell(row, 9).number(po.td_TC).style(styleCenter);
            ws.cell(row, 10).number(po.td_Khac).style(styleCenter);

            ws.cell(row, 11).number(po.tuoi_lt_31).style(styleCenter);
            ws.cell(row, 12).number(po.tuoi_31_40).style(styleCenter);
            ws.cell(row, 13).number(po.tuoi_41_50).style(styleCenter);
            ws.cell(row, 14).number(po.tuoi_51_55).style(styleCenter);
            ws.cell(row, 15).number(po.tuoi_gt_55).style(styleCenter);

            ws.cell(row, 16).number(po.tuoiDang_lt_5).style(styleCenter);
            ws.cell(row, 17).number(po.tuoiDang_5_10).style(styleCenter);
            ws.cell(row, 18).number(po.tuoiDang_11_20).style(styleCenter);
            ws.cell(row, 19).number(po.tuoiDang_21_30).style(styleCenter);
            ws.cell(row, 20).number(po.tuoiDang_gt_30).style(styleCenter);
        });
        // Tính tổng
        // Tính tổng, setwidth
        let total = content + new_position.length + 2;
        for(let col = 3; col <= 20; col++) {
            let sum = xlsx.getExcelCellRef(content, col) + ":" + xlsx.getExcelCellRef(total - 1, col);
            ws.cell(total, col).formula('sum('+sum+')').style(styleBold).style(styleCenter);
            ws.column(col).setWidth(10);
        }+

        ws.cell(h1, 1, total, 20).style(styleBorder);
        // Ký tên
        let row_sig = total + 2;
        ws.cell(row_sig + 1, 2).string("NGƯỜI LẬP BIỂU").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2, 2).string("(Ghi rõ họ tên)").style(styleCenter).style(styleItalic);
        let ntn = "ngày "+now.getDate()+", tháng "+(now.getMonth()+1)+", năm" + now.getFullYear();
        ws.cell(row_sig , 8).string("............., "+ntn).style(styleCenter).style(styleItalic);
        ws.cell(row_sig + 1 , 8).string("THỦ TRƯỞNG ĐƠN VỊ").style(styleCenter).style(styleBold);
        ws.cell(row_sig + 2 , 8).string("(Ký tên, đóng dấu, ghi rõ họ tên)").style(styleCenter).style(styleItalic);

        // Xuất file
        let time_file_name = now.getDate()+"-"+(now.getMonth()+1)+"-"+now.getFullYear();
        wb.write('chat-luong-dang-vien_'+time_file_name+'.xlsx', res);
    });

};