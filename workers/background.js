const icons = {
    enabled: "../images/icon.png",
    disabled: "../images/disabled-icon.png"
}
console.log("Background script started")

// Function that get the path of a file downloaded on Google Chrome 
urlValid = false
function isTorrentFile(path) {
    return path.endsWith(".torrent")
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        urlValid = tab?.url.includes("yggtorrent")
    }

    chrome.storage.sync.get(["ready", "timestamp"], ({ready, timestamp}) => {
        if (ready && Date.now() - timestamp > maxRequestAge)
            chrome.storage.sync.set({ready: false})

    });
})

chrome.tabs.onActivated.addListener(({tabId}) => {

    chrome.tabs.get(tabId, (tab) => {
        urlValid = tab?.url.includes("yggtorrent")
    })

});

// Start when a download is changed
chrome.downloads.onChanged.addListener(handleChanged)

// Get the path of the dl file if it's a torrent file
// Will launch the function that will encrypt the file in base64
function handleChanged(delta) {
    if (delta.state && delta.state.current === "complete" && urlValid) {
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