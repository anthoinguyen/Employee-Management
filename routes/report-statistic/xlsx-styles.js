module.exports = {
    bold: {
        font: {
            bold: true,
        },
    },
    italic: {
      font: {
          italics: true,
      }
    },
    center: {
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
    },
    left: {
        alignment: {
            horizontal: 'left',
            vertical: 'center'
        },
    },
    wrapText: {
        alignment: {
            wrapText: true,
        },
    },
    rotate90: {
        alignment: {
            textRotation: 90
        }
    },
    border: {
        border: {
            left: {
                style: 'thin',
                color: 'black',
            },
            right: {
                style: 'thin',
                color: 'black',
            },
            top: {
                style: 'thin',
                color: 'black',
            },
            bottom: {
                style: 'thin',
                color: 'black',
            },
            outline: false,
        },
    },
    title: {
        font: {
            size: 14,
            bold: true,
        },
    },
    header: {
        font: {
            bold: true,
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#cccccc',
            fgColor: '#cccccc',
        }
    },
};