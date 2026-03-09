const allContainer = document.getElementById("allContainer");
const cardDetailsModal = document.getElementById("card-details-modal");
const issueCountText = document.getElementById("issue-count-text");
const loadingSpinner = document.getElementById("loading-spinner");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

let allIssuesData = [];


async function loadAllIssues() {
    showLoading(true);
    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await res.json();
        allIssuesData = data.data;
        displayIssues(allIssuesData);
    } catch (error) {
        console.error("Error loading issues:", error);
    } finally {
        showLoading(false);
    }
}

function displayIssues(issues) {
    allContainer.innerHTML = "";
    issueCountText.innerText = `${issues.length} Issues`;

    if (issues.length === 0) {
        allContainer.innerHTML = `<p class="col-span-full text-center py-10 text-gray-400">No issues matching your criteria.</p>`;
        return;
    }

    issues.forEach((issue) => {
        const dateObject = new Date(issue.createdAt);

        const topBorderClass = issue.status.toLowerCase() === 'open' ? 'border-t-4 border-green-500' : 'border-t-4 border-purple-500';
        
        const card = document.createElement("div");
        card.className = `bg-white shadow-md rounded-lg p-5 flex flex-col justify-between hover:shadow-lg transition-shadow ${topBorderClass}`;
        
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-2">
                        <img src="${issue.status.toLowerCase() === 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png'}" class="w-5 h-5">
                        <span class="text-xs font-bold uppercase ${issue.status.toLowerCase() === 'open' ? 'text-green-600' : 'text-purple-600'}">
                            ${issue.status}
                        </span>
                    </div>
                    <span class="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        ${issue.priority}
                    </span>
                </div>

                <h3 class="font-bold text-lg cursor-pointer hover:text-blue-600 transition-colors line-clamp-2" 
                    onclick="openCardDetailsModal(${issue.id})">
                    ${issue.title}
                </h3>
                <p class="text-gray-500 text-sm mt-2 line-clamp-3">
                    ${issue.description}
                </p>

                <div class="mt-4 flex flex-wrap gap-2">
                    ${issue.labels.map(label => 
                        `<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold"># ${label}</span>`
                    ).join("")}
                </div>
            </div>

            <div class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-end text-xs text-gray-400">
                <div>
                    <p class="font-semibold text-gray-600">By: ${issue.author}</p>
                    <p>Assignee: ${issue.assignee || 'None'}</p>
                </div>
                <div class="text-right">
                    <p>${dateObject}</p>
                </div>
            </div>
        `;
        allContainer.appendChild(card);
    });
}


function toggleStyle(id) {
    const buttons = ['all-filter-btn', 'open-filter-btn', 'closed-filter-btn'];
    buttons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btnId === id) {
            btn.className = "bg-[#3B82F6] text-white px-6 py-2 rounded-lg font-medium transition-all cursor-pointer";
        } else {
            btn.className = "bg-white text-gray-600 border border-gray-200 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer";
        }
    });

    if (id === 'all-filter-btn') {
        displayIssues(allIssuesData);
    } else if (id === 'open-filter-btn') {
        displayIssues(allIssuesData.filter(i => i.status.toLowerCase() === 'open'));
    } else if (id === 'closed-filter-btn') {
        displayIssues(allIssuesData.filter(i => i.status.toLowerCase() === 'closed'));
    }
}




// document.addEventListener("DOMContentLoaded", () => {

    searchBtn.addEventListener("click", async () => {

        const query = searchInput.value.trim();

        if (query === "") {
            displayIssues(allIssuesData);
            return;
        }

        showLoading(true);

        try {
            const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
            const data = await res.json();

            displayIssues(data.data);

        } catch (err) {
            console.error("Search failed:", err);

        } finally {
            showLoading(false);
        }

    });

// });



// searchInput.addEventListener('input', async (e) => {
//     const query = e.target.value.trim();
//     if (query === "") {
//         displayIssues(allIssuesData);
//         return;
//     }

//     showLoading(true);
//     try {
//         const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
//         const data = await res.json();
//         displayIssues(data.data);
//     } catch (err) {
//         console.error("Search failed:", err);
//     } finally {
//         showLoading(false);
//     }
// });

// 
async function openCardDetailsModal(id) {
    
    cardDetailsModal.innerHTML = `<div class="modal-box text-center py-10"><span class="loading loading-spinner loading-md"></span></div>`;
    cardDetailsModal.showModal();

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await res.json();
        const issue = data.data;
        

        cardDetailsModal.innerHTML = `
            <div class="modal-box w-11/12 max-w-2xl">
                <h3 class="text-2xl font-bold mb-2">${issue.title} <span class="text-gray-300">#${issue.id}</span></h3>
                
                <div class="flex gap-3 items-center mb-6">
                    <span class="badge badge-success text-white py-3 px-4 uppercase text-[10px] font-bold">${issue.status}</span>
                    <p class="text-sm text-gray-500">• Opened by ${issue.author} on ${issue.createdAt}</p>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                    <p class="text-gray-700 leading-relaxed">${issue.description}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <p class="text-[10px] text-blue-400 font-bold uppercase mb-1">Assignee</p>
                        <p class="font-bold text-blue-800">${issue.assignee || 'Unassigned'}</p>
                    </div>
                    <div class="p-4 bg-red-50 rounded-lg">
                        <p class="text-[10px] text-red-400 font-bold uppercase mb-1">Priority</p>
                        <p class="font-bold text-red-800 uppercase">${issue.priority}</p>
                    </div>
                </div>
                
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8">Close</button>
                    </form>
                </div>
            </div>
        `;
    } catch (err) {
        cardDetailsModal.innerHTML = `<div class="modal-box text-center py-10">Failed to load details.</div>`;
    }
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingSpinner.classList.remove('hidden');
        allContainer.classList.add('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
        allContainer.classList.remove('hidden');
    }
}


loadAllIssues();