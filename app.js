var DATA
var TABLE

$(document).ready(async function() {
    console.log('Hand2Hold starting...');
    bsCustomFileInput.init()

    $('#upload-file-label').text('Upload CSV')

    $('#input-file').on('change', handleFileUpload)
    $('#add-row').on('click', handleAddRow)
    $('#submit').on('click', handleSubmit)
    $('#submit').prop("disabled", true)
    $('#add-row').prop("disabled", true)
})

function handleAddRow() {
    TABLE.alter('insert_row', 0, 1);
}

async function handleFileUpload(event) {
    const input = event.target

    if ('files' in input && input.files.length > 0) {
        let type = input.files[0].type
        let content = await readFileContent(input.files[0])

        console.log('Upload file type: ' + type);
        console.log('Upload file content: ' + content);

        switch (type) {
            case 'text/csv':
                DATA = await csv().fromString(content)
                TABLE = buildTable('#table', DATA)
                $('#submit').prop("disabled", false)
                $('#add-row').prop("disabled", false)
            break;
            default:
                console.error('Error: Uploaded file type not supported: ' + type);
        }
    }
}

function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

export function buildTable(table, data) {
    $(table).empty();

    let ch = getColumns(data[0])
    let c = getColumnsWithType(data[0])

    let settings = {
        data: data,
        columns: c,
        stretchH: 'all',
        maxRows: 500,
        rowHeaders: true,
        colHeaders: ch,
        manualRowMove: true,
        manualColumnMove: true,
        contextMenu: true,
        filters: true,
        dropdownMenu: true,
        allowRemoveColumn: true,
        allowInsertColumn: true,
        allowRemoveRow: true,
        allowInsertRow: true,
        allowEmpty: true,
        licenseKey: 'non-commercial-and-evaluation',
        tableClassName: ['table', 'table-hover', 'table-striped'],
        debug: true,
    };

    console.log('table settings:');
    console.log(settings);

    return new Handsontable(document.querySelector(table), settings)
}

function getColumns(o) {
    let k = Object.keys(o)
    let ch = []

    for (var i = 0; i < k.length; i++) {
        ch.push(k[i])
    }

    return ch
}

function getColumnsWithType(o) {
    let k = Object.keys(o)
    let c = []

    for (var i = 0; i < k.length; i++) {
        c.push({data: k[i], type: 'text'})
    }

    return c
}

function handleSubmit() {
    TABLE.validateCells(function(valid) {
        if (valid) {
            console.log('POST');
            console.log(TABLE.getSourceData());
            $('#submit').prop("disabled", true)
            $('#submit-spinner').prop("hidden", false)

            setTimeout(function(){
                toastr.success('Submitted successfully')
                $('#submit').prop("disabled", false)
                $('#submit-spinner').prop("hidden", true)
            }, 2000);

        } else {
            // error in data show;
            console.error('Data invalid');
            return
        }
    })
}
