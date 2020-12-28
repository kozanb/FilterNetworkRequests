document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['filteredUrl'], function (result) {
        filteredUrl = result.filteredUrl;
        if(filteredUrl)
            document.getElementById('filteredUrlInput').value = filteredUrl;
    });

    var filterBtn = document.getElementById('filteredFilterButton');

    filterBtn.addEventListener('click', function () {
        var urlInput = document.getElementById('filteredUrlInput');

        if (urlInput.value) {
            chrome.storage.local.set({
                filteredUrl: urlInput.value
            });

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
            });
        } else {
            alert('Please Enter a Url!');
        }
    }, false);

    var removeFilterBtn = document.getElementById('removeFilter');
    
    removeFilterBtn.addEventListener('click', function () {
        document.getElementById('filteredUrlInput').value = '';

        chrome.storage.local.remove('filteredUrl');
    }, false);
}, false);