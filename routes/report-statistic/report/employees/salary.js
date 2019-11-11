let mongoose = require('mongoose');
let xlsx = require('excel4node');
let moment = require('moment');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');

module.exports = router => {
    router.get('/nhan-vien/luong-phu-cap', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let new_position = [];
        return returnToUser.success(res, '', new_position);
    });

    router.get('/nhan-vien/luong-phu-cap/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
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
            .string('BÁO CÁO DANH SÁCH VÀ TIỀN LƯƠNG NHÂN VIÊN')
            .style(styleTitle);
        let time_str = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
        ws.cell(4, 4)
            .string('Tính đến ngày '+ time_str).style(styleItalic);
        // Header
        let h1 = 6;
        let h2 = 7;
        let h3 = 8;
        let content = 9;
        ws.row(h2).setHeight(50);
        ws.cell(h1, 1, h2, 1, true).string('STT').style(styleHeader);
        ws.column(1).setWidth(4);
        ws.cell(h1, 2, h2, 2, true).string('Họ và tên').style(styleHeader);
        ws.column(2).setWidth(25);
        ws.cell(h1, 3, h1, 4, true).string('Ngày tháng năm sinh').style(styleHeader).style(styleWrap);
        ws.cell(h2, 3).string('Nam').style(styleHeader).style(styleWrap);
        ws.cell(h2, 4).string('Nữ').style(styleHeader).style(styleWrap);
        ws.cell(h1, 5, h2, 5, true).string('Chức vụ/Chức danh').style(styleHeader).style(styleWrap);
        ws.cell(h1, 6, h2, 6, true).string('Đơn vị công tác').style(styleHeader).style(styleWrap);
        ws.cell(h1, 7, h2, 7, true).string('Thời gian giữ ngạch').style(styleHeader).style(styleWrap);
        ws.cell(h1, 8, h1, 9, true).string('Mức lương hiện hưởng').style(styleHeader).style(styleWrap);
        ws.cell(h2, 8).string('Hệ số lương').style(styleHeader).style(styleWrap);
        ws.cell(h2, 9).string('Mã ngạch hiện giữ').style(styleHeader).style(styleWrap);

        ws.cell(h1, 10, h1, 14, true).string('Phụ cấp').style(styleHeader).style(styleWrap);
        ws.cell(h2, 10).string('Chức vụ').style(styleHeader).style(styleWrap);
        ws.cell(h2, 11).string('Trách nhiệm').style(styleHeader).style(styleWrap);
        ws.cell(h2, 12).string('Khu vực').style(styleHeader).style(styleWrap);
        ws.cell(h2, 13).string('Phụ cấp vượt khung').style(styleHeader).style(styleWrap);
        ws.cell(h2, 14).string('Tổng phụ cấp theo phần trăm').style(styleHeader).style(styleWrap);

        ws.cell(h1, 15, h2, 15, true).string('Ghi chú').style(styleHeader).style(styleWrap);

        // Đánh số
        for(let ii = 1; ii <= 15; ii++) {
            ws.cell(h3, ii).string('('+ii+')').style(styleCenter);
        }
        // Thêm dữ liệu
        let salary = await mongoose.model('salary').find({}).exec();
        salary = await salary.filter((sala) => {
            if(sala.user.cuuNhanVien === false) {
                return sala;
            }
        });
        let salaryData = await Promise.all(salary.map(async sala => {
            let thoiGianGiuNgach = sala.ngach.nam;
            let maNgach = sala.ngach.maNgach;
            let bac = sala.bacHeso;
            let heSo = 1;
            sala.ngach.bacHeso.forEach((n, i, ns) => {
                if(n.bac === bac) {
                    heSo = n.heso;
                }
            });
            return {
                ...sala._doc,
                thoiGianGiuNgach,
                maNgach,
                bac,
                heSo
            }
        }));
        salaryData.forEach((sala, index, salas) => {
            let stt = index + 1;
            let row = content + index;
            ws.cell(row, 1).number(stt).style(styleCenter);
            ws.cell(row, 2).string(sala.user.name).style(styleCenter);

            if (sala.user.birthday) {
                let birthday = moment(sala.user.birthday).utc(7).format('DD/MM/YYYY');
                if(sala.user.gender === true) {
                    ws.cell(row, 3).string(birthday).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
                } else {
                    ws.cell(row, 4).string(birthday).style({ numberFormat: 'dd/mm/yyyy' }).style(styleCenter);
                }
            }

            let chucDanh = '';
            if(sala.user.positionId.length > 0) {
                chucDanh = sala.user.positionId[sala.user.positionId.length - 1].name
            }
            ws.cell(row, 5).string(chucDanh).style(styleCenter);
            let phongban = (sala.user.belongToDepartment.name === undefined) ? '' : sala.user.belongToDepartment.name;
            ws.cell(row, 6).string(phongban).style(styleCenter);
            ws.cell(row, 7).number(sala.thoiGianGiuNgach).style(styleCenter);
            ws.cell(row, 8).string(sala.heSo).style(styleCenter);
            ws.cell(row, 9).string(sala.maNgach).style(styleCenter);
        });
        let total = content + salaryData.length + 2;
        ws.cell(h1, 1, total, 15).style(styleBorder);

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
        wb.write('danh-sach-tien-luong-nhan-vien_'+time_file_name+'.xlsx', res);
    });

};