let mongoose = require('mongoose');
let xlsx = require('excel4node');
let moment = require('moment');
let returnToUser = require('../../../../services/returnToUsers');
let {checkPermission} = require('../../../../services/checkPermission');
let constants = require('../../../../routes/constants');
let styles = require('../../xlsx-styles');
let createReport = require('docx-templates');
let unidecode = require('unidecode');

function dot(n) {
    let dot = '...'
    for(i = 1; i < n; i++)
    {
        dot = dot + '...'
    }
    return dot;
}

function dateYear(date) {
    if(date)
        return moment(date).utc(7).format('YYYY');
    return "......."
}

function dateFull(date, reformat=true) {
    if(date)
        if(reformat)
            return moment(date).utc(7).format('DD/MM/YYYY');
        else
            return date;
    return "..../..../........."
}
function dateFullString(date) {
    if(date)
        return moment(date).locale('vi').utc(7).format("LL");
    return "...... tháng ...... năm ......"
}
function tochucCTXH(ngayThamGiaToChucCTXH) {
    if(ngayThamGiaToChucCTXH) {
        return ngayThamGiaToChucCTXH.map((ngay) => {
            if(ngay.name) {
                return ngay.name + ngay.dateIn ? " - Ngày vào: " + dateFull(ngay.dateIn) : ""
            }
        })
    } else {
        return []
    }
}
function khenthuong(kts) {
    if(kts) {
        return kts.map((item) => {
            return dateFull(item.quyetDinh.date, false) + ' - ' + item.title;
        })
    } else {
        return []
    }
}
function kyluat(kls) {
    if(kls) {
        return kls.map((item) => {
            return item.format + ' - ' + dateFull(item.quyetDinh.startedDate, false) + ' - ' + item.quyetDinh.org + ' - ' + item.description;
        })
    } else {
        return []
    }
}

function daotao(courses) {
    if(courses) {
        return courses.map(item => {
            return {
                trinhDo: item.trinhDo,
                diaDiem: item.diaDiem,
                hinhThuc: item.hinhThuc,
                ten: item.ten,
                thoiGian: "Từ " + dateFull(item.ngayBatDau, false) + " đến " + dateFull(item.ngayKetThuc, false),
            }
        })
    } else {
        return []
    }
}

function congtac(wks) {
    if(wks) {
        return wks.map(item => {
            return {
                nam_thang: "Từ " + dateFull(item.fromDate) + " đến " + dateFull(item.toDate),
                chucdanh_chucvu_donvi: item.description
            }
        })
    } else {
        return [];
    }
}
function relationship(rls) {
    if(rls) {
        return rls.map(item => {
            return {
                type: item.type,
                name: item.name,
                birthday: dateYear(item.birthday),
                description: item.description
            }
        })
    } else {
        return []
    }
}

function quatrinhluong(qtls) {
    if(qtls) {
        return qtls.map(item => {
            return {
                date: dateFull(item.date),
                scaleCode: item.scaleCode,
                salaryLevel: item.salaryLevel,
                coefficient: item.coefficient
            }
        })
    } else {
        return []
    }
}

module.exports = router => {
    router.get('/lylich2c/:user_id/export', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        const user_id = req.params.user_id;
        try {
            const user = await mongoose.model('users').findOne({"_id": user_id}).exec()
            if (!user)
            {
                return returnToUser.errorWithMess(res, 'Không tìm thấy');
            } else {
                const awards = await mongoose.model('awards').find({"user": user_id, "confirmed": true}).exec()
                const disciplines = await mongoose.model('users').find({"user": user_id, "confirmed": true}).exec()
                const courses = await mongoose.model('courses').find({"user": user_id, "confirmed": true}).exec();

                let ten_ngach, ma_ngach,bac_luong,he_so;
                const salary = await mongoose.model('salary').findOne({"user": user_id}).populate('ngach').exec();
                if(salary && salary.ngach) {
                    const ngach = await mongoose.model('systemSalary').findOne({"maNgach": salary.ngach.maNgach})
                    if(ngach) {
                        const heso = ngach.bacHeso.filter(item => {
                            if (salary.bacHeso === item.bac) {
                                return item.heso;
                            }
                        })
                        he_so = heso[0]['heso'] || dot(5);
                    }
                    ten_ngach = salary.ngach.tenNgach || dot(5);
                    ma_ngach = salary.ngach.maNgach || dot(5);
                    bac_luong =  salary.bacHeso || dot(5);
                } else {
                    ten_ngach = dot(5);
                    ma_ngach = dot(5);
                    bac_luong = dot(5);
                    he_so = dot(5);
                }

                let posi = {name: dot(5)}
                if(user.positionId.length > 0)
                {
                    posi = user.positionId[user.positionId.length - 1];
                }
                let data = {
                    so_hieu_can_bo: user.usersCardNumber || "",
                    ho_ten: user.name || dot(10),
                    nickName: user.nickName || dot(10),
                    chucvu: posi.name,
                    gioi_tinh: user.gender ? "Nam" : "Nữ" || dot(2),
                    ngay_thang_nam_sinh: dateFullString(user.birthday),
                    no_sinh: user.placeBirth.province || dot(3),
                    que_xa: user.hometown.commune || dot(3),
                    que_huyen: user.hometown.district || dot(3),
                    que_tinh: user.hometown.province || dot(3),
                    noi_o_hien_nay: user.registeredTemporaryResidence || dot(30),
                    sdt: user.phoneNumber || dot(3),
                    dan_toc: user.nation || dot(3),
                    ton_giao: user.religion || dot(3),
                    nghe_nghiep_truoc_tuyen_dung: user.occupationƯwhenRecruited || dot(5),
                    ntn_tuyendung: dateFull(user.recruitmentDay),
                    coquan_td: user.employmentAgency || dot(3),
                    noi_td: user.employmentAgency || dot(3),
                    ntn_coquan_hientai: dateFull(user.recruitmentDay),
                    ntn_thamgia_cachmang: "",
                    ntn_vaodang: dateFull(user.communist.dateIn),
                    ntn_vaodang_ct: dateFull(user.communist.officalDate),
                    ntn_vaodoan: user.youthUnion.yes ? "Đoàn TNCS Hồ Chí Minh - Ngày vào: " + dateFull(user.youthUnion.dateIn) : dot(3),
                    ctxh: tochucCTXH(user.ngayThamGiaToChucCTXH),
                    ntn_nhapngu: dateFull(user.army.dateIn),
                    ntn_xuatngu: dateFull(user.army.dateOut),
                    quan_ham: user.army.rank || dot(3),
                    td_hocvan: user.educationLevel.generalEducationLevel.whichClass || dot(3),
                    hocham_hocvi: user.educationLevel.highestProfessionalQualification || dot(3),
                    td_lyluanct: user.educationLevel.politicalTheory || dot(3),
                    td_qlnn: user.educationLevel.stateManagement || dot(3),
                    td_ngoaingu: (user.educationLevel.languageLevel.language + ": " + user.educationLevel.languageLevel.level) || dot(3),
                    cong_tac_chinh: user.mainJob || dot(5),
                    ten_ngach: ten_ngach,
                    ma_ngach: ma_ngach,
                    bac_luong: bac_luong,
                    he_so: he_so,
                    tn_bacluong: dateFull(user.payday),
                    danhhieu_duocphong: user.army.highestAward || dot(5),
                    sotruong_congtac: user.forte || dot(3),
                    congviec_lam_launhat: dot(5),
                    khen_thuong: khenthuong(awards),
                    ky_luat: kyluat(disciplines),
                    suc_khoe: user.health.status || dot(3),
                    chieu_cao: user.health.heigth || dot(3),
                    can_nang: user.health.weight || dot(3),
                    nhom_mau: user.health.bloodGroup || dot(3),
                    cmnd: user.IDCard.number || dot(5),
                    thuong_binh: user.veterans.type || dot(3),
                    giadinh_lietsi: dot(5),
                    quatrinh_daotao: daotao(courses),
                    quatrinh_congtac: congtac(user.workingProccess),
                    lichsu_banthan: user.personalHistory.question1 || dot(60),
                    nuocngoai_banthan: user.personalHistory.question2 || dot(60),
                    nuocngoai_thannhan: user.personalHistory.question3 || dot(60),
                    quanhe_banthan: relationship(user.familyRelationship.aboutMyself),
                    quanhe_vochong: relationship(user.familyRelationship.aboutOther),
                    qhluong: quatrinhluong(user.wageMovements)
                };
                const buffer = await createReport({
                    output: 'buffer',
                    // template: 'public/documents/DEMO.docx',
                    template: 'public/documents/SYLL_2C_TCTW-98.docx',
                    data: data
                });
                let now = new Date();
                let time_file_name = now.getDate()+"-"+(now.getMonth()+1)+"-"+now.getFullYear();
                res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.set('Content-Disposition', 'attachment;filename=so_yeu_ly_lich_'+ user.usersCardNumber + '_'+ unidecode(user.name.replace(' ', '_')) + '_' +time_file_name+'.docx');
                return res.send(buffer)
            }
        } catch (e) {
            return returnToUser.errorProcess(res, e);
        }
    });

};
