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
    } else if (type === 'recurring') {
        recurringFields.classList.remove('hidden');
    }
}

function toggleRecurringFields() {
    const recurringType = document.getElementById('recurringType').value;
    const dailyFields = document.getElementById('dailyFields');
    const weeklyFields = document.getElementById('weeklyFields');

    dailyFields.classList.add('hidden');
    weeklyFields.classList.add('hidden');

    if (recurringType === 'daily') {
        dailyFields.classList.remove('hidden');
    } else if (recurringType === 'weekly') {
        weeklyFields.classList.remove('hidden');
    }
}

document.getElementById('home-link').addEventListener('click', () => {
    // make fetch request
    getAllMedicationInfo();
});

document.getElementById('add-medication-link').addEventListener('click', async () => {
    updateContent(`<div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold mb-6">Medication Reminder Form</h1>
        <form id="medicationForm" onSubmit="submitHandler(event)">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="medicationName">Medication Name</label>
                <input type="text" name="medicationName" id="medicationName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Description</label>
                <textarea id="description" name="description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="type">Reminder Type</label>
                <select id="type" name="type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onchange="toggleFields()">
                    <option value="">Select Type</option>
                    <option value="oneTime">One Time</option>
                    <option value="recurring">Recurring</option>
                </select>
            </div>
            <div id="oneTimeFields" class="hidden">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="oneTimeDate">Date</label>
                    <input type="date" name="oneTimeDate" id="oneTimeDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="oneTimeTime">Time</label>
                    <input type="time" name="oneTimeTime" id="oneTimeTime" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
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
                </div>
                <div id="dailyFields" class="hidden">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="dailyStartDate">Start Date</label>
                        <input type="date" name="dailyStartDate" id="dailyStartDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="dailyEndDate">End Date</label>
                        <input type="date" name="dailyEndDate" id="dailyEndDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="dailyTime">Time</label>
                        <input type="time" name="dailyTime" id="dailyTime" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                </div>
                <div id="weeklyFields" class="hidden">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="weeklyStartDate">Start Date</label>
                        <input type="date" name="weeklyStartDate" id="weeklyStartDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="weeklyEndDate">End Date</label>
                        <input type="date" name="weeklyEndDate" id="weeklyEndDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="weeklyTime">Time</label>
                        <input type="time" name="weeklyTime" id="weeklyTime" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
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
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Submit</button>
            </div>
        </form>
    </div>`)
});

document.getElementById('report-generation-link').addEventListener('click', async () => {
    // make fetch request
});

async function submitHandler(event) {
    event.preventDefault();
    console.log(event.target);

    let formData = new FormData(event.target);

    let formDataObj = {};

    for (var [key, value] of formData.entries()) { 
        formDataObj[key] = value;
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

    console.log(formDataObj);
};

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
                                <th class="py-2 px-4 border-b">Name</th>
                                <th class="py-2 px-4 border-b">Description</th>
                                <th class="py-2 px-4 border-b">User ID</th>
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
                    row.className = 'text-center';

                    const nameCell = document.createElement('td');
                    nameCell.className = 'py-2 px-4 border-b';
                    nameCell.textContent = item.name;
                    row.appendChild(nameCell);

                    const descriptionCell = document.createElement('td');
                    descriptionCell.className = 'py-2 px-4 border-b';
                    descriptionCell.textContent = item.description;
                    row.appendChild(descriptionCell);

                    const userIdCell = document.createElement('td');
                    userIdCell.className = 'py-2 px-4 border-b';
                    userIdCell.textContent = item.user_id;
                    row.appendChild(userIdCell);

                    const actionCell = document.createElement('td');
                    actionCell.className = 'py-2 px-4 border-b';

                    const editButton = document.createElement('button');
                    editButton.className = 'bg-green-500 text-white py-1 px-3 rounded mr-2';
                    editButton.textContent = 'Edit';
                    editButton.onclick = () => editItem(item.id);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'bg-red-500 text-white py-1 px-3 rounded';
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteItem(item.id);

                    actionCell.appendChild(editButton);
                    actionCell.appendChild(deleteButton);

                    row.appendChild(actionCell);

                    tableBody.appendChild(row);
                });
    } else {
        contentContainer.innerHTML = `<div>No Data Found</div>`;
    }
}