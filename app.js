
const API_STORAGE_KEY = 'key-api';
const USER_STORAGE_KEY = 'user-id';

// Constants
const listId = 'd5192ca5-b7db-4866-a309-7161739f88d5';
const sprintId = '67691cd5f8193dc8b9430e98';
const primaryFieldId = 3416212;
const statusFieldId = 3416208;
const activeFieldId = 3429302;
const ownerFieldId = 3429822;
const assigneeFieldId = 3416209;

const statusOrder = [
    '8bf54526-6762-42e8-a326-c62a77894506',
    'a2830957-96e5-4709-aca0-df06fa3aafc3',
    '8ed92143-4014-402a-8c9a-c54effa45a39',
    'c1818389-a77d-468f-92e5-7f47fff6f3b8'
];

const listInput = document.getElementById('list-id');
const sprintInput = document.getElementById('sprint-id');
const apiInput = document.getElementById('api-key');
const userInput = document.getElementById('user-id');
const userTypeSelect = document.getElementById('user-type');

loadedRecords = [];

// Function to set the main input values
function setMainValues() {
    listInput.value = listId;
    sprintInput.value = sprintId;

    // load from storage
    apiInput.value = localStorage.getItem(API_STORAGE_KEY);
    userInput.value = localStorage.getItem(USER_STORAGE_KEY);

    // select
    const ownerFieldOption = document.createElement('option');
    ownerFieldOption.value = ownerFieldId;
    ownerFieldOption.selected = true;
    ownerFieldOption.textContent = 'Owner';
    userTypeSelect.appendChild(ownerFieldOption);

    const assigneeFieldOption = document.createElement('option');
    assigneeFieldOption.value = assigneeFieldId;
    assigneeFieldOption.textContent = 'Assignee';
    userTypeSelect.appendChild(assigneeFieldOption);
}

// Function to fetch records from the API
async function fetchRecords() {
    if (!apiInput.value || !userInput.value) {
        return;
    }

    const apiKey = apiInput.value;
    localStorage.setItem(API_STORAGE_KEY, apiKey);

    const userId = userInput.value;
    localStorage.setItem(USER_STORAGE_KEY, userId);

    const url = "https://api.workiom.com/api/services/app/Data/All";
    const headers = {
        "abp.tenantid": "8",
        "accept": "text/plain",
        "accept-language": "en-US,en;q=0.9,ar;q=0.8,tr;q=0.7,sl;q=0.6",
        "X-Api-Key": apiKey,
        "cache-control": "no-cache",
        "client-type": "Web",
        "client-version": "4.11.21.2",
        "content-type": "application/json-patch+json",
        "expires": "Sat, 01 Jan 2000 00:00:00 GMT",
        "origin": "https://w.workiom.com",
        "pragma": "no-cache",
        "referer": "https://w.workiom.com/",
        "sec-fetch-mode": "cors",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        "x-workiom-tenant-id": "8"
    };

    const body = {
        "listId": listId,
        "filter": [
            {
                "fieldId": 3416105,
                "operator": 3,
                "value": [
                    {
                        "_id": sprintId,
                        "label": "No Label"
                    }
                ],
                "viewId": 535375,
                "id": 341507
            }
        ],
        "filterCollectionOperator": 0,
        "viewFilter": [
            {
                "groupId": 99,
                "collectionOperator": 0,
                "fieldId": userTypeSelect.value,
                "operator": 12,
                "value": [
                    {
                        "id": userId
                    }
                ]
            }
        ],
        "viewFilterCollectionOperator": 0,
        "linkedItemsLimit": null,
        "projectedFields": [primaryFieldId, statusFieldId, activeFieldId],
        "quickSearch": "",
        "sorting": null,
        "maxResultCount": 200,
        "skipCount": 0,
        "viewId": 535375
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        loadedRecords = data.result.items.sort((a, b) => {
            const statusA = a[statusFieldId.toString()];
            const statusB = b[statusFieldId.toString()];

            return statusOrder.indexOf(statusA.id) - statusOrder.indexOf(statusB.id);
        });

        renderRecords(); // Assuming `items` contains the list of records
    } catch (error) {
        console.error("Error fetching records:", error);
        alert("Failed to load records. Please try again.");
    }
}

// Function to create and display the record list
function renderRecords() {
    const recordList = document.getElementById('recordList');
    recordList.innerHTML = ''; // Clear the list before rendering

    loadedRecords.forEach(record => {
        // Create list item
        const listItem = document.createElement('li');
        listItem.className = 'record-item';

        // Create icon
        const icon = document.createElement('i');
        icon.className = `icon ${record[activeFieldId.toString()] ? 'fa-solid fa-stop stop' : 'fa-solid fa-play start'}`;
        icon.onclick = () => toggleRecordState(record._id);

        // Create status
        const status = document.createElement('div');
        status.className = 'record-status';
        status.style.color = record[statusFieldId.toString()].color;
        status.style.border = `1px solid ${record[statusFieldId.toString()].color}`;
        status.textContent = record[statusFieldId.toString()].label;

        // Create title
        const title = document.createElement('div');
        title.className = 'record-title';
        title.textContent = record[primaryFieldId.toString()];

        // Append icon and title to list item
        listItem.appendChild(icon);
        listItem.appendChild(status);
        listItem.appendChild(title);

        // Append list item to the list
        recordList.appendChild(listItem);
    });
}

// Function to change the active state of a record
async function changeActiveState(recordId, active) {
    const apiKey = apiInput.value;

    const url = `https://api.workiom.com/api/services/app/Data/UpdatePartial?listId=${listId}&id=${recordId}`;
    const headers = {
        "abp.tenantid": "8",
        "accept": "text/plain",
        "accept-language": "en-US,en;q=0.9,ar;q=0.8,tr;q=0.7,sl;q=0.6",
        "X-Api-Key": apiKey,
        "cache-control": "no-cache",
        "client-type": "Web",
        "client-version": "4.11.21.2",
        "content-type": "application/json-patch+json",
        "expires": "Sat, 01 Jan 2000 00:00:00 GMT",
        "origin": "https://w.workiom.com",
        "pragma": "no-cache",
        "referer": "https://w.workiom.com/",
        "sec-fetch-mode": "cors",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        "x-workiom-tenant-id": "8"
    };

    const body = {
        [activeFieldId.toString()]: active
    };

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching records:", error);
        alert("Failed to load records. Please try again.");
    }
}

// Function to toggle the state of a record
function toggleRecordState(recordId) {
    const oldActiveRecord = loadedRecords.find(r => r[activeFieldId.toString()] && r._id !== recordId);
    if (oldActiveRecord) {
        oldActiveRecord[activeFieldId.toString()] = false;
        changeActiveState(oldActiveRecord._id, false);
    }


    const record = loadedRecords.find(r => r._id === recordId);
    if (record) {
        record[activeFieldId.toString()] = !record[activeFieldId.toString()];
        changeActiveState(record._id, record[activeFieldId.toString()]);
    }

    renderRecords(loadedRecords); // Re-render the list
}

// Set main input values
setMainValues();

// Initial render
fetchRecords();
