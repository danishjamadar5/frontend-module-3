function getUserIp() {
    $.getJSON("https://api.ipify.org?format=json", function (data) {
        let ipAddress = data.ip;
        console.log(ipAddress);

        let ipContainer = document.getElementById("ip");
        ipContainer.innerHTML = `${ipAddress}`;
    });
}
function getUserInfo() {
    let ip = document.getElementById("ip").innerHTML;
    fetch(`https://ipinfo.io/${ip}?token=f2b589224a5f9c`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            let [lat, long] = data.loc.split(",");
            let timezone = data.timezone;
            let pincode = data.postal;
            showInfo(lat, long, data);
            displayTimeZone(timezone, pincode);
        })
        .catch((error) => {
            console.log("Error :", error);
        });

}

// display data and map
function showInfo(lat, long, data) {
    const btn = document.querySelector(".btn");
    btn.classList.add("removeBtn");     // remove button after getting data
    let ipDetailsContainer = document.querySelector(".ipDetails-container");
    
    let infodiv = document.createElement("div");
    infodiv.classList.add("infodiv");
    infodiv.innerHTML = `
    <ul>
    <li>Lat: ${lat}</li>
    <li>Long: ${long}</li>
    </ul>
    <ul>
    <li>City: ${data.city}</li>
    <li>Region: ${data.region}</li>
    </ul>
    <ul >
    <li>Organisation: ${data.org}</li>
    <li>Hostname: ${data.hostname}</li>
    </ul >`;

    let mapcontainer = document.querySelector(".map-container");
    let mapdiv = document.createElement("div");
    mapdiv.classList.add("map");
    mapdiv.innerHTML = `<iframe src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed" width="100%" height="100%"></iframe>`
    
    ipDetailsContainer.append(infodiv);   // appending data
    mapcontainer.append(mapdiv);          // appending map
}

function displayTimeZone(timezone, pincode) {
    var pincodeCount = 0;    // counting the number of pincodes
    // API request to get postoffice
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((res) => res.json())
        .then((data) => {
            const postOffices = data[0].PostOffice;
            console.log(postOffices);
            postOffices.forEach((item) => {
                pincodeCount++;
            });

            let currentTime = new Date().toLocaleString("en-US", { timeZone: timezone });

            const timezoneContainer = document.querySelector(".timezone-container");
            timezoneContainer.innerHTML += `
            <ul>
                <li><strong>Time Zone:</strong> ${timezone}</li>
                <li><strong>Date And Time:</strong> ${currentTime}</li>
                <li><strong>Pincode:</strong> ${pincode}</li>
                <li><strong>Message: Number of pincode(s) found:</strong> ${pincodeCount}</li>
            </ul>
            `;
            // search bar
            const search = document.querySelector(".search");
            search.innerHTML += `
            <input type="text" id="searchBox" placeholder="Filter" oninput="filterPostOffice()">
            `;

            let postofficecontainer = document.querySelector(".postoffice-container")
            //display post offices
            postOffices.forEach((postoffice) => {
                postofficecontainer.innerHTML += `
                <ul>
                <li>Name: ${postoffice.Name}</li>
                <li>Branch Type: ${postoffice.BranchType}</li>
                <li>Delivery Status: ${postoffice.DeliveryStatus}</li>
                <li>District: ${postoffice.District}</li>
                <li>Division: ${postoffice.Division}</li>
                </ul>
                `;
            });
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}

//filter post offices
function filterPostOffice() {
    const searchBox = document.getElementById("searchBox");
    let value = searchBox.value.toLowerCase();
    let postofficecontainer = document.querySelector(".postoffice-container");
    const listItems = postofficecontainer.getElementsByTagName("ul");

    for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        const text = listItem.textContent || listItem.innerText;
        if (text.toLowerCase().indexOf(value) > -1) { 
            listItem.style.display = "";
        } else {
            listItem.style.display = "none";
        }
    }

}

getUserIp();
