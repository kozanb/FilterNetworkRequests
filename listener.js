var filteredUrl = '';

chrome.storage.local.get(['filteredUrl'], function (result) {
    filteredUrl = result.filteredUrl;
});

document.addEventListener('DOMContentLoaded', function () {
    if (filteredUrl) {
        var overrideListenerScript = document.createElement('script');
        overrideListenerScript.type = 'text/javascript';
        overrideListenerScript.innerHTML = `
        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
    
        var listener = function (callback) {
            var originalOpenFunction = XMLHttpRequest.prototype.open;
    
            XMLHttpRequest.prototype.open = function (method, url) {
                originalOpenFunction.apply(this, arguments);
                this.addEventListener('readystatechange', function () {
    
                    if (this.readyState === 4 && this.status === 200) {
                        if (typeof callback === 'function') {
                            try {
                                callback(url, this.responseText, method);
                            } catch (error) {
                                console.log('Err:' + error);
                            }
                        }
                    }
                });
            };
        };
    
        listener(function (url, response) {
            if (url.indexOf('${filteredUrl}') !== -1) {
                console.log('%cFiltered Response For ${filteredUrl}', 'background: black; color: yellow; font-size: x-medium; border-radius: 10px; padding: 2px');
                if(isJson(response)){
                    console.log(response);
                } else {
                    console.log(JSON.parse(response));
                }
                console.log('%cFiltered Response For ${filteredUrl}', 'background: black; color: yellow; font-size: x-medium; border-radius: 10px; padding: 2px');
            }
        });`;

        document.head.prepend(overrideListenerScript);
    }
});