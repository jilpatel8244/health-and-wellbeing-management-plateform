let socket = io();
let userId = parseInt(Array.from(document.getElementsByTagName('body'))[0].id);

socket.on('logout-from-all-devices', (data) => {
    console.log(data);
    if (userId === data) {
        location.reload();
    }
});

socket.on('logout-from-other-devices', (data) => {
    console.log(data);
    if (userId === data.userId && socket.id != data.socketId) {
        location.reload();
    }
});

socket.on('connect', () => {
    console.log('connected to server ' + socket.id);

    socket.emit('add-user-to-room', userId);
});

async function logoutFromOtherDevicesHandler() {
    try {
        const data = await fetch('/logout-other-devices', {
            method: 'POST',
            body: JSON.stringify({ socketId: socket.id }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await data.json();
        console.log(response);


    } catch (error) {
        console.log(error);
    }
}

const contentContainer = document.getElementById('content-container');
function updateContent(content) {
    contentContainer.innerHTML = content; // Update content container
}

function toggleFields() {
    const type = document.getElementById('type').value;
    const oneTimeFields = document.getElementById('oneTimeFields');
    const recurringFields = document.getElementById('recurringFields');

    oneTimeFields.classList.add('hidden');
    recurringFields.classList.add('hidden');

    if (type === 'oneTime') {
        oneTimeFields.classList.remove('hidden');

        document.getElementById('weeklyStartDate').value = '';
        document.getElementById('weeklyEndDate').value = '';
        document.getElementById('weeklyTime').value = '';

        document.getElementById('dailyStartDate').value = '';
        document.getElementById('dailyEndDate').value = '';
        document.getElementById('dailyTime').value = '';
    } else if (type === 'recurring') {
        recurringFields.classList.remove('hidden');

        document.getElementById('oneTimeDate').value = '';
        document.getElementById('oneTimeTime').value = '';
    }

    // remove fields value
}

function toggleRecurringFields() {
    const recurringType = document.getElementById('recurringType').value;
    const dailyFields = document.getElementById('dailyFields');
    const weeklyFields = document.getElementById('weeklyFields');

    dailyFields.classList.add('hidden');
    weeklyFields.classList.add('hidden');

    if (recurringType === 'daily') {
        dailyFields.classList.remove('hidden');

        // remove data of week field
        document.getElementById('weeklyStartDate').value = '';
        document.getElementById('weeklyEndDate').value = '';
        document.getElementById('weeklyTime').value = '';
        document.getElementById('dayOfWeek').options[0].selected = true;

    } else if (recurringType === 'weekly') {
        weeklyFields.classList.remove('hidden');

        // remove data of daily field
        document.getElementById('dailyStartDate').value = '';
        document.getElementById('dailyEndDate').value = '';
        document.getElementById('dailyTime').value = '';
    }

    // remove fields value
}

document.getElementById('home-link').addEventListener('click', (event) => {
    let aside_section = Array.from(document.getElementById('aside_section').children);
    aside_section.forEach((element) => {
        element.classList.remove('active');
    })

    event.target.classList.add('active');

    // make fetch request
    getAllMedicationInfo();
});

document.getElementById('add-medication-link').addEventListener('click', async (event) => {
    let aside_section = Array.from(document.getElementById('aside_section').children);
    aside_section.forEach((element) => {
        element.classList.remove('active');
    })

    event.target.classList.add('active');

    updateContent(`<div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold mb-6">Medication Reminder Form</h1>
        <form id="medicationForm" onSubmit="submitHandler(event)">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="medicationName">Medication Name</label>
                <input type="text" name="medicationName" id="medicationName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <span class="hidden text-red-500" id="medicationName_error"></span>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Description</label>
                <textarea id="description" name="description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                <span class="hidden text-red-500" id="description_error"></span>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="type">Reminder Type</label>
                <select id="type" name="type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onchange="toggleFields()">
                    <option value="">Select Type</option>
                    <option value="oneTime">One Time</option>
                    <option value="recurring">Recurring</option>
                </select>
                <span class="hidden text-red-500" id="type_error"></span>
            </div>
            <div id="oneTimeFields" class="hidden">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="oneTimeDate">Date</label>
                    <input type="date" onchange="checkStartDate(event)" name="oneTimeDate" id="oneTimeDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <span class="hidden text-red-500" id="oneTimeDate_error"></span>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="oneTimeTime">Time</label>
                    <input type="time" name="oneTimeTime" id="oneTimeTime" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <span class="hidden text-red-500" id="oneTimeTime_error"></span>
                </div>
            </div>
            <div id="recurringFields" class="hidden">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="recurringType">Recurring Type</label>
                    <select id="recurringType" name="recurringType" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onchange="toggleRecurringFields()">
                        <option value="">Select Recurring Type</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                    <span class="hidden text-red-500" id="recurringType_error"></span>
                </div>
                <div id="dailyFields" class="hidden">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="dailyStartDate">Start Date</label>
                        <input type="date" onchange="checkStartDate(event)" name="dailyStartDate" id="dailyStartDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <span class="hidden text-red-500" id="dailyStartDate_error"></span>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="dailyEndDate">End Date</label>
                        <input type="date" onchange="checkEndDate(event)" name="dailyEndDate" id="dailyEndDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <span class="hidden text-red-500" id="dailyEndDate_error"></span>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="dailyTime">Time</label>
                        <input type="time" name="dailyTime" id="dailyTime" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <span class="hidden text-red-500" id="dailyTime_error"></span>
                    </div>
                </div>
                <div id="weeklyFields" class="hidden">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="weeklyStartDate">Start Date</label>
                        <input type="date" onchange="checkStartDate(event)" name="weeklyStartDate" id="weeklyStartDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <span class="hidden text-red-500" id="weeklyStartDate_error"></span>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="weeklyEndDate">End Date</label>
                        <input type="date" onchange="checkEndDate(event)" name="weeklyEndDate" id="weeklyEndDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <span class="hidden text-red-500" id="weeklyEndDate_error"></span>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="weeklyTime">Time</label>
                        <input type="time" name="weeklyTime" id="weeklyTime" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <span class="hidden text-red-500" id="weeklyTime_error"></span>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="dayOfWeek">Day of the Week</label>
                        <select id="dayOfWeek" name="dayOfWeek" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="">select day of the week</option>
                            <option value="sunday">Sunday</option>
                            <option value="monday">Monday</option>
                            <option value="tuesday">Tuesday</option>
                            <option value="wednesday">Wednesday</option>
                            <option value="thursday">Thursday</option>
                            <option value="friday">Friday</option>
                            <option value="saturday">Saturday</option>
                        </select>
                        <span class="hidden text-red-500" id="dayOfWeek_error"></span>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Submit</button>
            </div>
        </form>
    </div>
    `)
});

function checkStartDate(event) {
    let selectedDate = event.target;

    let today = new Date().toISOString().split('T')[0];

    if (selectedDate.value < today) {
        alert("you cannot select the date before today");
        selectedDate.value = '';
    }

    let endDate;
    if (selectedDate.name === 'dailyStartDate') {
        endDate = document.getElementById('dailyEndDate');
    } else if (selectedDate.name === 'weeklyStartDate') {
        endDate = document.getElementById('weeklyEndDate');
    }

    if (selectedDate.name != 'oneTimeDate') {
        if (endDate.value) {
            if (endDate.value < selectedDate.value) {
                alert('start date can not be greater than end date');
                selectedDate.value = '';
            }
        }
    }
}

function checkEndDate(event) {
    let endDate = event.target;
    let startDate;
    if (event.target.name === 'dailyEndDate') {
        startDate = document.getElementById('dailyStartDate');
    } else {
        startDate = document.getElementById('weeklyStartDate');
    }

    if (!startDate.value) {
        alert('please select start date first');
        endDate.value = '';
    }
    if (startDate.value > endDate.value) {
        alert('end date cannot be smaller than start date');
        endDate.value = '';
    }
}

document.getElementById('report-generation-link').addEventListener('click', async (event) => {
    let aside_section = Array.from(document.getElementById('aside_section').children);
    aside_section.forEach((element) => {
        element.classList.remove('active');
    })

    event.target.classList.add('active');

    let htmlContent = `<form onSubmit="reportFormHandler(event)" name="reportGenerationForm" id="reportGenerationForm" class="bg-white mx-auto p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Select Date Range</h2>
        
        <div class="mb-4">
            <label for="startDate" class="block text-gray-700 font-medium mb-2">Start Date</label>
            <input type="date" onchange="checkReportStartDate(event)" id="startDate" name="startDate" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div class="mb-4">
            <label for="endDate" class="block text-gray-700 font-medium mb-2">End Date</label>
            <input type="date" onchange="checkReportEndDate(event)" id="endDate" name="endDate" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <button type="submit" class="w-full bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Submit
        </button>
    </form>
    `

    updateContent(htmlContent);
    document.getElementById('startDate').max = new Date().toISOString().split("T")[0];
    document.getElementById('endDate').max = new Date().toISOString().split("T")[0];
});

function checkReportStartDate(event) {
    let startDate = event.target;

    let today = new Date().toISOString().split('T')[0];

    if (startDate.value > today) {
        alert("you cannot select the date before today");
        startDate.value = '';
    }

    let endDate = document.getElementById('endDate');

    if (endDate.value) {
        if (endDate.value < startDate.value) {
            alert('start date can not be greater than end date');
            startDate.value = '';
        }
    }
}

function checkReportEndDate(event) {
    let endDate = event.target;
    let startDate = document.getElementById('startDate');

    if (!startDate.value) {
        alert('please select start date first');
        endDate.value = '';
    }
    if (startDate.value > endDate.value) {
        alert('end date cannot be smaller than start date');
        endDate.value = '';
    }
}

async function submitHandler(event) {
    event.preventDefault();

    let formData = new FormData(event.target);

    let formDataObj = {};

    for (var [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }

    if (!validateMadicationForm(formDataObj)) {
        return false;
    }

    try {
        const data = await fetch('/medication/add-medication', {
            method: 'POST',
            body: JSON.stringify(formDataObj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await data.json();
        console.log(response);

        if (response.success) {
            let url = window.origin + '/home';
            window.location.href = url;
        }
    } catch (error) {
        console.log(error);
    }
}

function validateMadicationForm(formDataObj) {
    console.log(formDataObj);
    let validate = true;

    let errorSpan;
    if (!formDataObj.medicationName) {
        validate = false;
        activateErrorSpan(`medicationName_error`, 'please enter medication name');
    }
    if (!formDataObj.description) {
        validate = false;
        activateErrorSpan(`description_error`, 'please enter medication description');
    }
    if (!formDataObj.type) {
        validate = false;
        activateErrorSpan(`type_error`, 'please enter reminder type');
    }
    if (formDataObj.type === 'oneTime') {
        if (!formDataObj.oneTimeDate) {
            validate = false;
            activateErrorSpan(`oneTimeDate_error`, 'please enter date');
        }
        if (!formDataObj.oneTimeTime) {
            validate = false;
            activateErrorSpan(`oneTimeTime_error`, 'please enter time');
        }
    } else if (formDataObj.type === 'recurring') {
        if (!formDataObj.recurringType) {
            validate = false;
            activateErrorSpan(`recurringType_error`, 'please enter recurring type');
        }
        if (formDataObj.recurringType === 'daily') {
            if (!formDataObj.dailyStartDate) {
                validate = false;
                activateErrorSpan(`dailyStartDate_error`, 'please enter start date');
            }
            if (!formDataObj.dailyEndDate) {
                validate = false;
                activateErrorSpan(`dailyEndDate_error`, 'please enter end date');
            }
            if (!formDataObj.dailyTime) {
                validate = false;
                activateErrorSpan(`dailyTime_error`, 'please enter time');
            }
        } else if (formDataObj.recurringType === 'weekly') {
            if (!formDataObj.weeklyStartDate) {
                validate = false;
                activateErrorSpan(`weeklyStartDate_error`, 'please enter start date');
            }
            if (!formDataObj.weeklyEndDate) {
                validate = false;
                activateErrorSpan(`weeklyEndDate_error`, 'please enter end date');
            }
            if (!formDataObj.weeklyTime) {
                validate = false;
                activateErrorSpan(`weeklyTime_error`, 'please enter time');
            }
            if (!formDataObj.dayOfWeek) {
                validate = false;
                activateErrorSpan(`dayOfWeek_error`, 'please select day of the week');
            }
        }
    }
    return validate;
}

function activateErrorSpan(id, text) {
    errorSpan = document.getElementById(id);
    errorSpan.innerHTML = text;
    errorSpan.classList.remove('hidden');
}

async function getAllMedicationInfo() {
    try {
        let data = await fetch('/medication/get-user-medications', {
            method: 'GET'
        });
        data = await data.json();
        console.log(data);

        if (data.success) {
            appendData(data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

function appendData(data) {
    if (data.length) {
        updateContent(`<table id="data-table" class="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th class="py-2 px-4 border-b">Id</th>
                                <th class="py-2 px-4 border-b">Medicine Name</th>
                                <th class="py-2 px-4 border-b">Description</th>
                                <th class="py-2 px-4 border-b">Type</th>
                                <th class="py-2 px-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody id="table-body">
                            <!-- Rows will be inserted here by JavaScript -->
                        </tbody>
                    </table>`);

        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; // Clear existing rows

        data.forEach(item => {
            const row = document.createElement('tr');
            row.setAttribute('id', item.id);
            row.className = 'text-center';

            const idCell = document.createElement('td');
            idCell.className = 'py-2 px-4 border-b';
            idCell.textContent = item.id;
            row.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.className = 'py-2 px-4 border-b';
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.className = 'py-2 px-4 border-b';
            descriptionCell.textContent = item.description;
            row.appendChild(descriptionCell);

            const typeCell = document.createElement('td');
            typeCell.className = 'py-2 px-4 border-b';
            typeCell.textContent = item.Reminders[0].type;
            row.appendChild(typeCell);

            const actionCell = document.createElement('td');
            actionCell.className = 'py-2 px-4 border-b';

            const viewButton = document.createElement('button');
            viewButton.className = 'bg-blue-500 text-white py-1 px-3 rounded  mr-2';
            viewButton.textContent = 'View';
            viewButton.onclick = () => openViewModal(item.id);

            const editButton = document.createElement('button');
            editButton.className = 'bg-green-500 text-white py-1 px-3 rounded mr-2';
            editButton.textContent = 'Edit';
            editButton.onclick = () => openEditModel(item.id);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'bg-red-500 text-white py-1 px-3 rounded';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteItem(item.id);

            actionCell.appendChild(viewButton);
            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    } else {
        contentContainer.innerHTML = `<div>No madication added yet</div>`;
    }
}

async function openViewModal(medicineId) {
    try {
        let data = await fetch(`/medication/get-medication-info-by-id?id=${medicineId}`, {
            method: 'GET'
        });
        data = await data.json();
        console.log(data);

        if (data.success) {
            let { id, name, description, createdAt } = data.message;
            let { type, day_of_week, start_date, end_date, one_time_date, time } = data.message.Reminders[0];

            document.getElementById('medicineName').innerText = name;
            document.getElementById('medicineDescription').innerText = description;
            document.getElementById('medicineType').innerText = type;
            document.getElementById('time').innerText = time;
            document.getElementById('created_at').innerText = new Date(createdAt).toLocaleString();

            if (type === 'oneTime') {
                document.getElementById('oneTime').classList.remove('hidden');
                document.getElementById('one_time_date').innerText = one_time_date;
                document.getElementById('recurring').classList.add('hidden');
                document.getElementById('weekly').classList.add('hidden');
            } else if (type === 'daily') {
                document.getElementById('recurring').classList.remove('hidden');
                document.getElementById('start_date').innerText = start_date;
                document.getElementById('end_date').innerText = end_date;
                document.getElementById('oneTime').classList.add('hidden');
                document.getElementById('weekly').classList.add('hidden');
            } else {
                document.getElementById('recurring').classList.remove('hidden');
                document.getElementById('weekly').classList.remove('hidden');
                document.getElementById('start_date').innerText = start_date;
                document.getElementById('end_date').innerText = end_date;
                document.getElementById('day_of_week').innerText = day_of_week;
                document.getElementById('oneTime').classList.add('hidden');
            }
        }
    } catch (error) {
        console.log(error);
    }

    document.getElementById('medicineViewModal').classList.remove('hidden');
}

async function openEditModel(medicineId) {
    try {
        let data = await fetch(`/medication/get-medication-info-by-id?id=${medicineId}`, {
            method: 'GET'
        });
        data = await data.json();
        console.log(data);

        if (data.success) {
            let { id, name, description } = data.message;
            let { type, day_of_week, start_date, end_date, one_time_date, time } = data.message.Reminders[0];

            document.getElementById('medicationId').value = id;
            document.getElementById('medicationName').value = name;
            document.getElementById('description').value = description;

            let selectType = document.getElementById('type');
            if (type === 'oneTime') {
                selectType.options[1].selected = true;
                document.getElementById('oneTimeFields').classList.remove('hidden');

                document.getElementById('oneTimeDate').value = one_time_date;
                document.getElementById('oneTimeTime').value = time;

            } else {
                selectType.options[2].selected = true;
                document.getElementById('recurringFields').classList.remove('hidden');

                let selectedRecurringType = document.getElementById('recurringType');

                if (!day_of_week) {
                    selectedRecurringType.options[1].selected = true;
                    document.getElementById('dailyFields').classList.remove('hidden');

                    document.getElementById('dailyStartDate').value = start_date;
                    document.getElementById('dailyEndDate').value = end_date;
                    document.getElementById('dailyTime').value = time;
                } else {
                    selectedRecurringType.options[2].selected = true;
                    document.getElementById('weeklyFields').classList.remove('hidden');

                    document.getElementById('weeklyStartDate').value = start_date;
                    document.getElementById('weeklyEndDate').value = end_date;
                    document.getElementById('weeklyTime').value = time;

                    let dayOfWeekSelect = document.getElementById('dayOfWeek');
                    for (const element of dayOfWeekSelect.options) {
                        if (element.value === day_of_week) {
                            element.selected = true;
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

    document.getElementById('medicationEditModel').classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');

    if (id === 'medicationEditModel') {
        document.getElementById('updateMedicationForm').reset();

        document.getElementById('oneTimeFields').classList.add('hidden');
        document.getElementById('recurringFields').classList.add('hidden');
        document.getElementById('dailyFields').classList.add('hidden');
        document.getElementById('weeklyFields').classList.add('hidden');

        // hide error span tag
        let allErrorSpanTags = Array.from(document.getElementById('updateMedicationForm').querySelectorAll('span'));
        allErrorSpanTags.forEach((element) => {
            element.classList.add('hidden');
        });
    }
}

async function reportFormHandler(event) {
    event.preventDefault();

    let formData = new FormData(event.target);

    let formDataObj = {};

    for (var [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }

    try {
        const response = await fetch('/report/generate-report', {
            method: 'POST',
            body: JSON.stringify(formDataObj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // const response = await data.json();
        // console.log(response);

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'custom_report.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            Swal.fire({
                type: 'success',
                text: 'report send successfully',
            });
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteItem(id) {
    try {
        let result = await Swal.fire({
            type: 'warning',
            title: 'Are You Sure?',
            text: "You wouldn't be retrive this!",
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        console.log(result);

        if (result.value) {
            let data = await fetch('/medication/delete-medication', {
                method: 'POST',
                body: JSON.stringify({ id: id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const response = await data.json();
            console.log(response);

            if (response.success) {
                Swal.fire('Deleted!', 'Your item has been deleted.', 'success');

                document.getElementById(id).remove();
                if (!document.getElementById('table-body').childElementCount) {
                    document.getElementById('content-container').innerHTML = `<div>No madication added yet</div>`;
                }
            } else {
                Swal.fire('Error!', 'There was a problem deleting your item.', 'error');
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function updateHandler(event) {
    event.preventDefault();

    let formData = new FormData(event.target);

    let formDataObj = {};

    for (var [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }

    if (!validateMadicationForm(formDataObj)) {
        return false;
    }

    try {
        const data = await fetch('/medication/update-medication', {
            method: 'PUT',
            body: JSON.stringify(formDataObj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await data.json();
        console.log(response);

        if (response.success) {
            if (response.toast) {
                triggerToast(response.message, response.toastType, null, '/home');
            }
            // let url = window.origin + '/home';
            // window.location.href = url;
        }
    } catch (error) {
        console.log(error);
    }
}

document.getElementById('add-data-using-csv-link').addEventListener('click', async (event) => {
    let aside_section = Array.from(document.getElementById('aside_section').children);
    aside_section.forEach((element) => {
        element.classList.remove('active');
    })

    event.target.classList.add('active');

    updateContent(`<form id="uploadCsvForm" onsubmit="uploadCsvHandler(event)" enctype="multipart/form-data">
                            <input type="file" name="file" accept=".csv" required />
                            <button type="submit" class="bg-green-500 text-white py-1 px-3 rounded mr-2">Upload CSV</button>
                        </form>`);

});

async function uploadCsvHandler(event) {
    try {
        event.preventDefault();

        const formData = new FormData(event.target);

        const data = await fetch('/medication/upload-csv', {
            method: 'POST',
            body: formData
        });

        const response = await data.json();
        if (response.success) {
            console.log(response);
        }
        if (response.toast) {
            triggerToast(response.message, response.toastType, null, '/home', null);
        }
    } catch (error) {
        console.log(error);
    }
}