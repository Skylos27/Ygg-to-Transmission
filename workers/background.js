const icons = {
    enabled: "images/icon.png",
    disabled: "images/disabled-icon.png"
}
console.log("Background script started")

// Function that get the path of a file downloaded on Google Chrome 

function isTorrentFile(path) {
    return path.endsWith(".torrent")
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        const urlValid = tab?.url.includes("yggtorrent")
        if(urlValid)
        {
            console.log("Valid1")
        }
        else
        {
            console.log("Not valid1")
        }
    }

    chrome.storage.sync.get(["ready", "timestamp"], ({ready, timestamp}) => {
        if (ready && Date.now() - timestamp > maxRequestAge)
            chrome.storage.sync.set({ready: false})

    });
})

chrome.tabs.onActivated.addListener(({tabId}) => {

    chrome.tabs.get(tabId, (tab) => {
        const urlValid = tab?.url.includes("yggtorrent")
        if(urlValid)
        {
            console.log("Valid2")
        }
        else
        {
            console.log("Not valid2")
        }
    })

});

// Start when a download is created
chrome.downloads.onCreated.addListener(
    function(downloadItem) {
        downloadId = downloadItem.id
        path = downloadItem.filename
        console.log(downloadItem.state)
    }
  )

// Start when a download is changed
chrome.downloads.onChanged.addListener(handleChanged)

// Get the path of the dl file if it's a torrent file
// Will launch the function that will encrypt the file in base64
function handleChanged(delta) {
    if (delta.state && delta.state.current === "complete") {
        chrome.downloads.search({id: delta.id}, function(items) {
            if(isTorrentFile(items[0].filename))
            {
                console.log("Torrent file")
            }
            console.log(items[0].filename)
        });
        
        console.log(`Download ${delta.id} has completed.`);
    }
}