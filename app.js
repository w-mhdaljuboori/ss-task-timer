
const API_STORAGE_KEY = 'key-api';
const USER_STORAGE_KEY = 'user-id';

const apiInput = document.getElementById('api-key');
const userInput = document.getElementById('user-id');

loadedRecords = [];


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
        "listId": "b2a42566-eb5c-40bb-15d8-08d601df4183",
        "filter": [
            {
                "fieldId": 718556,
                "operator": 4,
                "value": [
                    {
                        "id": "fcfb04c4-d71d-4770-b370-d13bc472bad0",
                        "label": "Mob",
                        "order": null,
                        "color": null,
                        "isClosed": null
                    }
                ],
                "viewId": 374311,
                "id": 331678
            },
            {
                "fieldId": 11281,
                "operator": 12,
                "value": [
                    {
                        "id": "8c36513d-7256-4518-9580-3b984ed84fff",
                        "label": "Sprint Backlog"
                    },
                    {
                        "id": "19757813-ec9a-4449-8683-0938202504d0",
                        "label": "On Hold"
                    },
                    {
                        "id": "1534331844077",
                        "label": "Dev InProg ⚡️"
                    },
                    {
                        "id": "adc67eb2-36a0-4e9b-9f1f-203db14da6f4",
                        "label": "Ready for CR"
                    },
                    {
                        "id": "03d81fc8-99ce-4249-874a-6a9e49ab95f8",
                        "label": "CR InProg ⚡️"
                    },
                    {
                        "id": "63474306-7068-4a8a-b4c2-657f69ca4f9f",
                        "label": "Waiting Dev Testing"
                    },
                    {
                        "id": "855a651a-5cdf-4db8-a8f2-8d553150ee7f",
                        "label": "Dev Testing InProg ⚡️"
                    },
                    {
                        "id": "345aadf2-f4f4-4b3b-ba6b-f2d284ec30b5",
                        "label": "Pending"
                    },
                    {
                        "id": "8627a434-b532-4ae4-b56a-a168bcc66446",
                        "label": "UI/UX Review ⚡️"
                    },
                    {
                        "id": "1534331846355",
                        "label": "To Test"
                    },
                    {
                        "id": "50809651-e07a-451b-b78f-dae672541529",
                        "label": "Test InProg ⚡️"
                    },
                    {
                        "id": "f2cd3506-cc9d-456f-92cc-4dc6c0be4f59",
                        "label": "Post Production Testing"
                    },
                    {
                        "id": "0774e84f-d9ea-46a3-b838-da51a6a23c2a",
                        "label": "Blocked"
                    },
                    {
                        "id": "eab4d35c-d366-466c-a867-2d39d2c5bb9b",
                        "label": "Pending Merge"
                    }
                ],
                "viewId": 374311,
                "id": 331679
            }
        ],
        "filterCollectionOperator": 0,
        "viewFilter": [
            {
                "groupId": 99,
                "collectionOperator": 0,
                "fieldId": 11278,
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
        "projectedFields": [11276, 11281, 3302869],
        "quickSearch": "",
        "sorting": "2717827 ASC",
        "maxResultCount": 200,
        "skipCount": 0
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
        loadedRecords = data.result.items;
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
        icon.className = `icon ${record['3302869'] ? 'fa-solid fa-stop stop' : 'fa-solid fa-play start'}`;
        icon.onclick = () => toggleRecordState(record._id);

        // Create status
        const status = document.createElement('div');
        status.className = 'record-status';
        status.style.color = record['11281'].color;
        status.style.border = `1px solid ${record['11281'].color}`;
        status.textContent = record['11281'].label;

        // Create title
        const title = document.createElement('div');
        title.className = 'record-title';
        title.textContent = record['11276'];

        // Append icon and title to list item
        listItem.appendChild(icon);
        listItem.appendChild(status);
        listItem.appendChild(title);

        // Append list item to the list
        recordList.appendChild(listItem);
    });
}

async function changeActiveState(recordId, active) {
    const apiKey = apiInput.value;

    const url = `https://api.workiom.com/api/services/app/Data/UpdatePartial?listId=b2a42566-eb5c-40bb-15d8-08d601df4183&id=${recordId}`;
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
      "3302869": active
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
    const oldActiveRecord = loadedRecords.find(r => r['3302869'] && r._id !== recordId);
    if (oldActiveRecord) {
        oldActiveRecord['3302869'] = false;
        changeActiveState(oldActiveRecord._id, false);
    }


    const record = loadedRecords.find(r => r._id === recordId);
    if (record) {
        record['3302869'] = !record['3302869'];
        changeActiveState(record._id, record['3302869']);
    }

    renderRecords(loadedRecords); // Re-render the list
}

// load from storage
apiInput.value = localStorage.getItem(API_STORAGE_KEY);
userInput.value = localStorage.getItem(USER_STORAGE_KEY);

// Initial render
fetchRecords();
