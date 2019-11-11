let mongoose = require('mongoose');
let xlsx = require('excel4node');
let moment = require('moment');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/nhan-vien/chuc-danh', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let postions = await mongoose.model('positions').aggregate([
            {$group: {
                _id: "$name",
            }}]).exec();
        let users = await mongoose.model('users').find({'cuuNhanVien': false}).populate('positionId').exec();
        let new_position = postions.map((posi, index, posis)=>{
            let count_all = 0;
            let count_girl = 0;
            let count_danToc = 0;
            let count_trenDH = 0;
            let count_DH = 0;
            let count_CD = 0;
            let count_TC = 0;
            let count_Khac = 0;
            let count_dangVien = 0;
            let count_dangVienNu = 0;
            users.forEach((u, i, us) => {
                if(u.positionId.length > 0)
                if(u.positionId[u.positionId.length - 1].name === posi._id){
                    count_all++;
                    if(!u.gender) count_girl++;
                    if(u.nation !== 'Kinh') count_danToc++;
                    if(u.educationLevel !== undefined && u.educationLevel.highestProfessionalQualification  !== undefined)
                    {
                        let tdcm = u.educationLevel.highestProfessionalQualification;
                        switch (tdcm) {
                            case "Tiến sĩ": count_trenDH += 1; break;
                            case "Thạc sĩ": count_trenDH += 1; break;
                            case "Đại học": count_DH += 1; break;
                            case "Cao đẳng": count_CD += 1; break;
                            case "Trung cấp": count_TC += 1; break;
                            default: count_Khac += 1; break;
                        }
                    }
                    if(u.communist !== undefined && u.communist.yes) count_dangVien++;
                    if(u.communist !== undefined && u.communist.yes && !u.gender) count_dangVienNu++;
                }
            });
            return {
                name: posi._id,
                count_girl,
                count_danToc,
                count_trenDH,
                count_DH,
                count_CD,
                count_TC,
                count_Khac,
                count_dangVien,
                count_dangVienNu,
            }
        });

        return returnToUser.success(res, '', new_position);
    });

    router.get('/nhan-vien/chuc-danh/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
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
            .string('BÁO CÁO CƠ CẤU NHÂN VIÊN THEO CHỨC DANH')
            .style(styleTitle);
        let time_str = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
        ws.cell(4, 4)
            .string('Tính đến ngày '+ time_str).style(styleItalic);
        // Header
        let h1 = 6;
        let h2 = 7;

        let content = 8;
        ws.row(h2).setHeight(50);
        ws.cell(h1, 1, h2, 1, true).string('STT').style(styleHeader);
        ws.column(1).setWidth(4);
        ws.cell(h1, 2, h2, 2, true).string('Chức danh').style(styleHeader);
        ws.column(2).setWidth(25);
        ws.cell(h1, 3, h1, 5, true).string('Tổng số').style(styleHeader).style(styleWrap);
        ws.cell(h2, 3).string('Tổng').style(styleHeader).style(styleWrap);
        ws.cell(h2, 4).string('Nữ').style(styleHeader).style(styleWrap);
        ws.cell(h2, 5).string('Dân tộc').style(styleHeader).style(styleWrap);

        ws.cell(h1, 6, h1, 10, true).string('Trình độ chuyên môn').style(styleHeader).style(styleWrap);
        ws.cell(h2, 6).string('Trên ĐH').style(styleHeader).style(styleWrap);
        ws.cell(h2, 7).string('ĐH').style(styleHeader).style(styleWrap);
        ws.cell(h2, 8).string('CĐ').style(styleHeader).style(styleWrap);
        ws.cell(h2, 9).string('TC').style(styleHeader).style(styleWrap);
        ws.cell(h2, 10).string('Còn lại').style(styleHeader).style(styleWrap);

        ws.cell(h1, 11, h1, 12, true).string('Đảng viên').style(styleHeader).style(styleWrap);
        ws.cell(h2, 11).string('Tổng').style(styleHeader).style(styleWrap);
        ws.cell(h2, 12).string('Nữ').style(styleHeader).style(styleWrap);
        // Thêm dữ liệu
        let postions = await mongoose.model('positions').aggregate([
            {$group: {
                    _id: "$name",
                }}]).exec();
        let users = await mongoose.model('users').find({'cuuNhanVien': {$ne: true}}).populate('positionId').exec();
        let new_position = postions.map((posi, index, posis)=>{
            let count_all = 0;
            let count_girl = 0;
            let count_danToc = 0;
            let count_trenDH = 0;
            let count_DH = 0;
            let count_CD = 0;
            let count_TC = 0;
            let count_Khac = 0;
            let count_dangVien = 0;
            let count_dangVienNu = 0;
            users.forEach((u, i, us) => {
                if(u.positionId.length > 0)
                if(u.positionId[u.positionId.length - 1].name === posi._id){
                    count_all++;
                    if(!u.gender) count_girl++;
                    if(u.nation !== 'Kinh') count_danToc++;
                    if(u.educationLevel !== undefined && u.educationLevel.highestProfessionalQualification  !== undefined)
                    {
                        let tdcm = u.educationLevel.highestProfessionalQualification;
                        switch (tdcm) {
                            case "Tiến sĩ": count_trenDH += 1; break;
                            case "Thạc sĩ": count_trenDH += 1; break;
                            case "Đại học": count_DH += 1; break;
                            case "Cao đẳng": count_CD += 1; break;
                            case "Trung cấp": count_TC += 1; break;
                            default: count_Khac += 1; break;
                        }
                    }
                    if(u.communist !== undefined && u.communist.yes) count_dangVien++;
                    if(u.communist !== undefined && u.communist.yes && !u.gender) count_dangVienNu++;
                }
            });
            return {
                name: posi._id,
                count_all,
                count_girl,
                count_danToc,
                count_trenDH,
                count_DH,
                count_CD,
                count_TC,
                count_Khac,
                count_dangVien,
                count_dangVienNu,
            }
        });

        new_position.forEach((po, i, pos)=>{
            let row = content + i;
            ws.cell(row, 1).number(i+1).style(styleCenter);
            ws.cell(row, 2).string(po.name).style(styleCenter);
            ws.cell(row, 3).number(po.count_all).style(styleCenter);
            ws.cell(row, 4).number(po.count_girl).style(styleCenter);
            ws.cell(row, 5).number(po.count_danToc).style(styleCenter);
            ws.cell(row, 6).number(po.count_trenDH).style(styleCenter);
            ws.cell(row, 7).number(po.count_DH).style(styleCenter);
            ws.cell(row, 8).number(po.count_CD).style(styleCenter);
            ws.cell(row, 9).number(po.count_TC).style(styleCenter);
            ws.cell(row, 10).number(po.count_Khac).style(styleCenter);
            ws.cell(row, 11).number(po.count_dangVien).style(styleCenter);
            ws.cell(row, 12).number(po.count_dangVienNu).style(styleCenter);
        });

        // Tính tổng, setwidth
        let total = content + new_position.length + 2;
        for(let col = 3; col <= 12; col++) {
            let sum = xlsx.getExcelCellRef(content, col) + ":" + xlsx.getExcelCellRef(total - 1, col);
            ws.cell(total, col).formula('sum('+sum+')').style(styleBold).style(styleCenter);
            ws.column(col).setWidth(10);
        }+

            ws.cell(h1, 1, total, 12).style(styleBorder);

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
        wb.write('co-cau-nhan-vien-chuc-danh_'+time_file_name+'.xlsx', res);
    });

};