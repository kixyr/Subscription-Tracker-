

// Detect when a CSV file is downloaded
chrome.downloads.onCreated.addListener((downloadItem) => {
  console.log('niggg')
  
  chrome.downloads.search({ id: downloadItem.id }, (results) => {
    console.log(results)
    let downloadTime = downloadItem.startTime ? new Date(downloadItem.startTime).toISOString() : new Date().toISOString();

    if (results.length === 0) return;
    if(results[0].mime.split('/')[1] === "csv"){
      chrome.storage.local.set({ isCsv: true , downloadTime});
    }
  });
});
