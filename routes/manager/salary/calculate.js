let calculate = (settings, salary) => {
    let luongCoBan = settings.luongCoBan;
    let heso = 1;
    salary.ngach.bacHeso.map((item, index, items) => {
        if(item.bac === salary.bacHeso) {
            heso = item.heso;
        }
    });
    let phucap = 0;
    salary.phuCap.map((item, index, items) => {
       phucap = phucap + item.soTien;
    });
    return luongCoBan*parseFloat(heso) + phucap;
};
module.exports = calculate;