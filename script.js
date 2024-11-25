// Sample dynamic data for demonstration
const tables = {
    "Table1": [
        { "Location": "Queens", "Count": 11 },
        { "Location": "Brooklyn", "Count": 12 },
        { "Location": "Manhattan", "Count": 20 }
    ],
    "Table2": [
        { "Puppy_Name": "Snowflake", "Vaccines_OK": "No", "Owner": "Paula Reardon" },
        { "Puppy_Name": "Juicy", "Vaccines_OK": "Yes", "Owner": "Esteban Howe" },
        { "Puppy_Name": "Snowball", "Vaccines_OK": "No", "Owner": "Hiroto Sato" }
    ]
};

let selectedTable = null;
let selectedColumns = [];
let selectedRows = [];

// Manage steps
function nextStep(step) {
    document.querySelector(".step.active").classList.remove("active");
    document.getElementById(`step-${step}`).classList.add("active");

    if (step === 2) {
        loadTablePreview();
    } else if (step === 3) {
        createDynamicSelection();
    } else if (step === 4) {
        previewFinalSelection();
    }
}

function previousStep(step) {
    document.querySelector(".step.active").classList.remove("active");
    document.getElementById(`step-${step}`).classList.add("active");
}

// Step 1: Load Table Options
window.onload = function () {
    const tableSelectionDiv = document.getElementById("table-selection");
    let html = "";
    for (const tableName in tables) {
        html += `<button onclick="selectTable('${tableName}')">${tableName}</button>`;
    }
    tableSelectionDiv.innerHTML = html;
};

function selectTable(tableName) {
    selectedTable = tableName;
    alert(`Selected Table: ${tableName}`);
}

// Step 2: Preview Table Data
function loadTablePreview() {
    if (!selectedTable) {
        alert("Please select a table first.");
        return;
    }

    const tableData = tables[selectedTable];
    let previewHtml = "<table><tr>";

    // Create headers
    Object.keys(tableData[0]).forEach(key => {
        previewHtml += `<th>${key}</th>`;
    });
    previewHtml += "</tr>";

    // Populate rows
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

// Step 3: Create Row/Column Selection
function createDynamicSelection() {
    const tableData = tables[selectedTable];
    let html = "<table><tr>";

    // Headers with selectable columns
    Object.keys(tableData[0]).forEach((key, index) => {
        html += `<th onclick="toggleColumn('${key}', ${index})">${key}</th>`;
    });
    html += "</tr>";

    // Rows with selectable cells
    tableData.forEach((row, rowIndex) => {
        html += `<tr onclick="toggleRow(${rowIndex})">`;
        Object.values(row).forEach(value => {
            html += `<td>${value}</td>`;
        });
        html += "</tr>";
    });
    html += "</table>";

    document.getElementById("dynamic-table-selection").innerHTML = html;

    // Clear previous selections
    selectedColumns = Object.keys(tableData[0]);
    selectedRows = tableData.map((_, index) => index);
}

// Toggle Column Selection
function toggleColumn(column, index) {
    const columnIndex = selectedColumns.indexOf(column);
    if (columnIndex > -1) {
        selectedColumns.splice(columnIndex, 1);
        document.querySelectorAll(`th:nth-child(${index + 1}), td:nth-child(${index + 1})`).forEach(el => el.classList.remove("selected"));
    } else {
        selectedColumns.push(column);
        document.querySelectorAll(`th:nth-child(${index + 1}), td:nth-child(${index + 1})`).forEach(el => el.classList.add("selected"));
    }
}

// Toggle Row Selection
function toggleRow(index) {
    const rowIndex = selectedRows.indexOf(index);
    if (rowIndex > -1) {
        selectedRows.splice(rowIndex, 1);
        document.querySelectorAll(`tr:nth-child(${index + 2})`).forEach(el => el.classList.remove("selected"));
    } else {
        selectedRows.push(index);
        document.querySelectorAll(`tr:nth-child(${index + 2})`).forEach(el => el.classList.add("selected"));
    }
}

// Step 4: Final Preview and Download
function previewFinalSelection() {
    const tableData = tables[selectedTable];
    let html = "<table><tr>";

    // Headers
    selectedColumns.forEach(col => {
        html += `<th>${col}</th>`;
    });
    html += "</tr>";

    // Rows
    selectedRows.forEach(rowIndex => {
        html += "<tr>";
        selectedColumns.forEach(col => {
            html += `<td>${tableData[rowIndex][col]}</td>`;
        });
        html += "</tr>";
    });
    html += "</table>";

    document.getElementById("final-preview").innerHTML = html;
}

// Download as CSV
function confirmDownload() {
    const confirmed = confirm("Are you sure you want to download the selected data as CSV?");
    if (confirmed) {
        downloadCSV();
    }
}

function downloadCSV() {
    const tableData = tables[selectedTable];
    let csvContent = selectedColumns.join(",") + "\n";

    selectedRows.forEach(rowIndex => {
        const row = selectedColumns.map(col => tableData[rowIndex][col]);
        csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTable}_data.csv`;
    a.click();
}
