// Name: Rami Hammoud rami_hammoud@student.uml.edu
// Date: 12/3/2023
// File: script.js
// GUI Assignment: HW4 Adding Sliders and new tabs

// Description: Functionality behind web page. Reads in user inputs, handles
//invalid inputs gracefully with jQUERY, and generates table. It now also 
// adds a slider under each user input and updates the table. Each table
// that is created makes a new table tab. You can delete all the tabs
// at once by selecting the checkboxes or x out individually. Table
// dynamically updates on input.

$(document).ready(function() {

    $.validator.addMethod('checkStartHorizontal', function(value, element, params) {
        var startHorizontal = parseInt($('#startHorizontal').val());
        var endHorizontal = parseInt($('#endHorizontal').val());
        return startHorizontal <= endHorizontal;
    }, 'Minimum Column value cannot be greater than Maximum Column value.');

    $.validator.addMethod('checkStartVertical', function(value, element, params) {
        var startVertical = parseInt($('#startVertical').val());
        var endVertical = parseInt($('#endVertical').val());
        return startVertical <= endVertical;
    }, 'Minimum Row value cannot be greater than Maximum Row value.');

    $('#startHorizontal, #endHorizontal, #startVertical, #endVertical').on('input', function() {
        updateMainTable();
    });

    $('#inputForm').validate({
        rules: {
            startHorizontal: {
                required: true,
                number: true,
                range: [-50, 50],
                checkStartHorizontal: true
            },
            endHorizontal: {
                required: true,
                number: true,
                range: [-50, 50]
            },
            startVertical: {
                required: true,
                number: true,
                range: [-50, 50],
                checkStartVertical: true
            },
            endVertical: {
                required: true,
                number: true,
                range: [-50, 50]
            }
        },
        messages: {
            startHorizontal: {
                required: 'Please enter a value for Minimum Column.',
                number: 'Please enter a valid number for Minimum Column.',
                range: 'Please enter a value between -50 and 50 for Minimum Column.',
                checkStartHorizontal: 'Minimum Column value cannot be greater than Maximum Column value.'
            },
            endHorizontal: {
                required: 'Please enter a value for Maximum Column.',
                number: 'Please enter a valid number for Maximum Column.',
                range: 'Please enter a value between -50 and 50 for Maximum Column.'
            },
            startVertical: {
                required: 'Please enter a value for Minimum Row.',
                number: 'Please enter a valid number for Minimum Row.',
                range: 'Please enter a value between -50 and 50 for Minimum Row.',
                checkStartVertical: 'Minimum Row value cannot be greater than Maximum Row value.'
            },
            endVertical: {
                required: 'Please enter a value for Maximum Row.',
                number: 'Please enter a valid number for Maximum Row.',
                range: 'Please enter a value between -50 and 50 for Maximum Row.'
            }
        },
        
        submitHandler: function(form) {
            if ($('#inputForm').valid()) {
                generateTable();
            }
            return false; 
        }
    });

    $("#sliderMinCol").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#startHorizontal").val(ui.value);
            updateMainTable();
        }
    });

    $("#sliderMaxCol").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#endHorizontal").val(ui.value);
            updateMainTable();
        }
    });

    $("#sliderMinRow").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#startVertical").val(ui.value);
            updateMainTable();
        }
    });

    $("#sliderMaxRow").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#endVertical").val(ui.value);
            updateMainTable();
        }
    });
//----------------------------------------------------------
    $("#tabs").tabs({
        activate: function(event, ui) {
            const tabId = ui.newPanel.attr('id');
            const tabLabel = tabId.replace('tab-', '');
            const [startH, endH, startV, endV] = tabLabel.split('-').map(Number);
            const tabContent = generateTableContent(startH, endH, startV, endV);

            $("#tableContainer").empty().html(tabContent);
        }
    });

// generates rows/columns in table
    function generateTableContent(startH, endH, startV, endV) {
        let tableContent = `<table class="table table-bordered table-striped">`;
        tableContent += '<thead><tr><th></th>';
        for (let i = startH; i <= endH; i++) {
            tableContent += `<th>${i}</th>`;
        }
        tableContent += '</tr></thead><tbody>';
        for (let i = startV; i <= endV; i++) {
            tableContent += `<tr><th>${i}</th>`;
            for (let j = startH; j <= endH; j++) {
                tableContent += `<td>${i * j}</td>`;
            }
            tableContent += `</tr>`;
        }
        tableContent += `</tbody></table>`;
        return tableContent;
    }

    function addOrUpdateTab(startH, endH, startV, endV) {
        const tabLabel = `${startH}-${endH}-${startV}-${endV}`;
        if ($(`#tab-${tabLabel}`).length === 0) {
            createTableTab(startH, endH, startV, endV);
        }
    }
 // generates the table
    function generateTable() {
        const startHorizontal = parseInt($('#startHorizontal').val());
        const endHorizontal = parseInt($('#endHorizontal').val());
        const startVertical = parseInt($('#startVertical').val());
        const endVertical = parseInt($('#endVertical').val());
    
        addOrUpdateTab(startHorizontal, endHorizontal, startVertical, endVertical);
        $("#tabs").tabs("option", "active", -1);
    }

    // to update the sliders based on the input
    function updateSlider(sliderId, inputId) {
        $(sliderId).slider('value', parseInt($(inputId).val()));
        updateMainTable(); 
    }

    // even listeners
    $('#startHorizontal').on('input', function() {
        updateSlider('#sliderMinCol', '#startHorizontal');
    });

    $('#endHorizontal').on('input', function() {
        updateSlider('#sliderMaxCol', '#endHorizontal');
    });

    $('#startVertical').on('input', function() {
        updateSlider('#sliderMinRow', '#startVertical');
    });

    $('#endVertical').on('input', function() {
        updateSlider('#sliderMaxRow', '#endVertical');
    });

// create the tables per tabs created
    function createTableTab(startH, endH, startV, endV) {
        const tabLabel = `${startH}-${endH}-${startV}-${endV}`;
        const tabTemplate = `<li><input type="checkbox" id="tabCheckbox-${tabLabel}"><a href="#tab-${tabLabel}">${tabLabel}</a><span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>`;
        const tabContentHTML = `<div id="tab-${tabLabel}" class="table-container"></div>`;
        
        $("#tabs ul").append(tabTemplate);
        $("#tabs").append(tabContentHTML);
        $("#tabs").tabs("refresh");
        
        $(`#tabs a[href="#tab-${tabLabel}"] span.ui-icon-close`).click(function () {
            const panelId = $(this).closest("li").remove().attr("aria-controls");
            $(`#${panelId}`).remove();
            $("#tabs").tabs("refresh");
        });
    }
// x out tabs

    $("#tabs ul").on("click", "li span.ui-icon-close", function() {
        const panelId = $(this).closest("li").remove().attr("aria-controls");
        $(`#${panelId}`).remove();
        $("#tabs").tabs("refresh");
    });

    //delete button functionality
    $('#deleteSelectedTabs').on('click', function() {
        $('#tabs ul li input:checked').each(function() {
            const tabId = $(this).attr('id').replace('tabCheckbox-', 'tab-');
            console.log("Deleting tab ID:", tabId);
            $("#" + tabId).remove(); // Remove the tab content
            console.log("Tab content removed:", tabId);
            $(this).closest('li').remove(); // Remove the tab itself
            console.log("Tab removed:", tabId);
        });
        $("#tabs").tabs("refresh");
    });
    //updates to dynamically change table
    function updateMainTable() {
        const startHorizontal = parseInt($('#startHorizontal').val());
        const endHorizontal = parseInt($('#endHorizontal').val());
        const startVertical = parseInt($('#startVertical').val());
        const endVertical = parseInt($('#endVertical').val());

        let tableContent = generateTableContent(startHorizontal, endHorizontal, startVertical, endVertical);
        $("#tableContainer").empty().html(tableContent);
    }

});


function generateTable() {
    // Get input values from UI
    const startHorizontal = parseInt(document.getElementById('startHorizontal').value);
    const endHorizontal = parseInt(document.getElementById('endHorizontal').value);
    const startVertical = parseInt(document.getElementById('startVertical').value);
    const endVertical = parseInt(document.getElementById('endVertical').value);

    // Clear existing error message
    // clearErrorMessage();

    // Input validation for range
    if (isNaN(startHorizontal) || isNaN(endHorizontal) || isNaN(startVertical) || isNaN(endVertical)) {
        // displayErrorMessage('Please enter valid numbers for all fields.');
        return;
    }

    if (startHorizontal < -50 || endHorizontal > 50 || startVertical < -50 || endVertical > 50) {
        // displayErrorMessage('Please enter values within the range of -50 to 50.');
        return;
    }

    if (startHorizontal >= endHorizontal || startVertical >= endVertical) {
        // displayErrorMessage('Start values cannot be greater than end values.');
        return;
    }

    // Clear existing table
    document.getElementById('tableContainer').innerHTML = '';

    // generate the table
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');

    // Create table headers
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th></th>';
    for (let i = startHorizontal; i <= endHorizontal; i++) {
        headerRow.innerHTML += `<th>${i}</th>`;
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table rows
    for (let i = startVertical; i <= endVertical; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<th>${i}</th>`;
        for (let j = startHorizontal; j <= endHorizontal; j++) {
            row.innerHTML += `<td>${i * j}</td>`;
        }
        table.appendChild(row);
    }

    // Append table to the container in HTML
    document.getElementById('tableContainer').appendChild(table);
}

// function displayErrorMessage(message) {
//     const errorMessageElement = document.getElementById('errorMessage');
//     if (errorMessageElement) {
//         errorMessageElement.innerHTML = message;
//         errorMessageElement.style.display = 'block';
//     } else {
//         const errorMessageDiv = document.createElement('div');
//         errorMessageDiv.id = 'errorMessage';
//         errorMessageDiv.className = 'alert alert-danger';
//         errorMessageDiv.textContent = message;
//         document.getElementById('tableContainer').insertBefore(errorMessageDiv, document.getElementById('tableContainer').firstChild);
//     }
// }

// function clearErrorMessage() {
//     const errorMessageElement = document.getElementById('errorMessage');
//     if (errorMessageElement) {
//         errorMessageElement.style.display = 'none';
//     }
// }
