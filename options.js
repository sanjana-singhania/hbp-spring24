document.addEventListener('DOMContentLoaded', function() {
    var blockedURLInput = document.getElementById("blockedURL");
    var listURL = document.getElementById("listURL");
    const key = "productivity under the sea";

    // Function to add a new blocked URL to the list
    function addBlockedURL(url) {
        var li = document.createElement("li");
        li.textContent = url;
        listURL.appendChild(li);

    }

    function addToLocal(url) {
        let items = JSON.parse(localStorage.getItem(key) || '[]');
        if (!items.includes(url)) {
            items.push(url);
        }
        localStorage.setItem(key, JSON.stringify(items));
    }

    function populateFromLocal() {
        
        let storage = localStorage.getItem(key);
        if(storage) {
            const items = JSON.parse(storage);
            if(items) {
                for(const url of items) {
                    addBlockedURL(url);
                }
            }
        }

    }

    populateFromLocal();
    function removeFromLocal(url) {
        let items = JSON.parse(localStorage.getItem(key) || '[]');
        items = items.filter(item => item !== url);
        localStorage.setItem(key, JSON.stringify(items));
    }

    blockedURLInput.addEventListener('keypress', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            var newURLtext = blockedURLInput.value.trim();
            console.log("New URL text:", newURLtext);
            if (newURLtext !== '') {
                addBlockedURL(newURLtext);
                addToLocal(newURLtext);
                blockedURLInput.value = ''; 
            }
        }
    });

    listURL.addEventListener('click', function(event) {
        var clickedItem = event.target;
        if (clickedItem.tagName === 'LI') { // Ensure that the clicked element is a list item
            clickedItem.remove(); // Remove the clicked list item
            removeFromLocal(clickedItem.innerText);
        }

    });
});
