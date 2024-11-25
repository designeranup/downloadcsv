// Sample data tables in JSON format
const tables = {
    "Table1": [
        { "Location": "Queens", "Count": 11 },
        { "Location": "Brooklyn", "Count": 12 }
    ],
    "Table2": [
        { "Puppy_Name": "Snowflake", "Vaccines_OK": false, "Owner": "Paula Reardon" },
        { "Puppy_Name": "Juicy", "Vaccines_OK": false, "Owner": "Esteban Howe" }
    ]
};

// State to store selected data
let selectedTable = null;
let selectedColumns = [];
let selectedRows = [];

// Manage steps visibility
function nextStep(step) {
    document.querySelector(".step.active").classList.remove("active");
    document.getElementById(`step-${step}`).classList.add("active");

    if (step === 2) {
        previewTable();
    } else if (step === 3) {
        selectColumnsAndRows();
    } else if (step === 4) {
        previewFinalSelection();
    }
}

function previousStep(step) {
    document.querySelector(".step.active").classList.remove("active");
    document.getElementById(`step-${step}`).classList.add("active");
}

// Preview the selected table (Step 2)
function previewTable() {
    selectedTable = document.getElementById("table-select").value;
    const tableData = tables[selectedTable];
    let previewHtml = "<table border='1'><tr>";

    // Create table headers
    Object.keys(tableData[0]).forEach(key => {
        previewHtml += `<th>${key}</th>`;
    });
    previewHtml += "</tr>";

    // Add table rows
    tableData.forEach(row => {
        previewHtml += "<tr>";
        Object.values(row).forEach(value => {
            previewHtml += `<td>${value}</td>`;
        });
        previewHtml += "</tr>";
    });
    previewHtml += "</table>";

    document.getElementById("table-preview").innerHTML = previewHtml;
}

// Allow user to select columns and rows (Step 3)
function selectColumnsAndRows() {
    const tableData = tables[selectedTable];
    const columns = Object.keys(tableData[0]);
    let html = "<h3>Select Columns:</h3>";

    // Create checkboxes for columns
    columns.forEach((col, index) => {
        html += `<input type="checkbox" id="col-${index}" value="${col}" checked> ${col}<br>`;
    });

    html += "<h3>Select Rows:</h3>";

    // Create checkboxes for rows
    tableData.forEach((row, index) => {
        html += `<input type="checkbox" id="row-${index}" value="${index}" checked> Row ${index + 1}<br>`;
    });

    document.getElementById("column-row-select").innerHTML = html;
}

// Preview the final selection before download (Step 4)
function previewFinalSelection() {
    const tableData = tables[selectedTable];
    selectedColumns = [];
    selectedRows = [];

    // Get selected columns
    Object.keys(tableData[0]).forEach((col, index) => {
        if (document.getElementById(`col-${index}`).checked) {
            selectedColumns.push(col);
        }
    });

    // Get selected rows
    tableData.forEach((_, index) => {
        if (document.getElementById(`row-${index}`).checked) {
            selectedRows.push(index);
        }
    });

    // Create preview HTML
    let previewHtml = "<table border='1'><tr>";
    selectedColumns.forEach(col => {
        previewHtml += `<th>${col}</th>`;
    });
    previewHtml += "</tr>";

    selectedRows.forEach(rowIndex => {
        previewHtml += "<tr>";
        selectedColumns.forEach(col => {
            previewHtml += `<td>${tableData[rowIndex][col]}</td>`;
        });
        previewHtml += "</tr>";
    });
    previewHtml += "</table>";

    document.getElementById("final-preview").innerHTML = previewHtml;
}

// Confirm download with warning
function confirmDownload() {
    const confirmed = confirm("Are you sure to download it as a CSV?");
    if (confirmed) {
        downloadCSV();
    } else {
        nextStep(1);
    }
}

// Download the selected data as CSV
function downloadCSV() {
    const tableData = tables[selectedTable];
    let csvContent = selectedColumns.join(",") + "\n";

    selectedRows.forEach(rowIndex => {
        let row = selectedColumns.map(col => tableData[rowIndex][col]);
        csvContent += row.join(",") + "\n";
    });

    // Create a downloadable link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTable}_data.csv`;
    a.click();
}
