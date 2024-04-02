/*
Project - Identity Details Tweaks
Version - 2.0
Author - Shandeep - https://www.linkedin.com/in/shandeepsrinivas/
*/

function customLog(logString) {
    if (debugMode)
        console.log(logString);
}

function identityDetailsTweaksObserverForMutation(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function identityDetailsTweaksObserverForMutation2(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function identityDetailsTweaksObserverForMutation3(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function identityDetailsTweaksExec(settings) {
    customLog("settings - " + JSON.stringify(settings));
    var appsToHide = settings.appsToHide;
    var identityAttributesToHide = settings.identityAttributesToHide;
    var disableDetailsActionButton = settings.disableDetailsActionButton;
    var disableEntLinks = settings.disableEntLinks;
    var isAdmin = settings.isAdmin;

    customLog("appsToHide - " + appsToHide);
    customLog("identityAttributesToHide - " + identityAttributesToHide);
    customLog("disableDetailsActionButton - " + disableDetailsActionButton);
    customLog("disableEntLinks - " + disableEntLinks);
    customLog("isAdmin - " + isAdmin);

    if (!isAdmin) {
        if (appsToHide || identityAttributesToHide) {
            let oldXHROpen = window.XMLHttpRequest.prototype.open;
            window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                this.addEventListener('load', function () {
                    customLog('url: ' + url);
                    var res = this.response;
                    Object.defineProperty(this, 'response', { writable: true });
                    Object.defineProperty(this, 'responseText', { writable: true });

                    if (appsToHide && (url.includes("/links/?") || url.includes("/access/identityEntitlements?"))) {
                        customLog("Calling links or identityEntitlements..");
                        var jsonResponse = JSON.parse(res);
                        customLog('before: ' + JSON.stringify(jsonResponse));
                        var objects = jsonResponse.objects;

                        for (var i = objects.length - 1; i >= 0; i--) {
                            for (let appToHide of appsToHide.split(',')) {
                                if (((objects[i].applicationName) && (objects[i].applicationName === appToHide.trim())) || ((objects[i].application) && (objects[i].application === appToHide.trim()))) {
                                    customLog("removing - " + JSON.stringify(objects.splice(i, 1)));
                                    break;
                                }
                            }
                        }

                        let computedCount = 0;
                        let paramArray = url.split("?");
                        if (paramArray.length > 1) {
                            let params = paramArray[1];
                            let paramsArray = params.split('&');
                            for (let p of paramsArray) {
                                if (p.includes('limit=') || p.includes('start=')) {
                                    computedCount = computedCount + Number(p.split('=')[1]);
                                }
                            }
                        }

                        if (objects.length == 0 && url.includes("applicationOrNameOrValue")) {
                            jsonResponse.count = objects.length;
                        } else if (objects.length == 0 && computedCount >= jsonResponse.count) {
                            jsonResponse.count = objects.length;
                        } else if (objects.length == 0 && jsonResponse.count != 0) {
                            objects[0] = JSON.parse('{"accountId": "", "actionStatus": null, "applicationName": "", "approvalStatus": null, "attributes": null, "id": "123", "identityId": "123", "lastRefresh": 1706000390708, "passwordChangeDate": null, "passwordChangeErrors": null, "passwordPolicy": ["Password must have at least 1 letter(s)", "Password must have at most 6 character(s)", "Password must have at least 1 lowercase letter(s)", "Password must have at least 6 character(s)", "Password must have at least 1 special character(s)", "Password must have at least 1 digit(s)", "Password must have at least 1 uppercase letter(s)"], "requiresCurrentPassword": false, "status": "ACTIVE"}');
                            identityDetailsTweaksObserverForMutation(".data-table, panel").then((elm) => {
                                customLog("Clicking next..")
                                $("a[aria-label='Next Page']").click()
                            });

                        }
                        jsonResponse.objects = objects;
                        res = jsonResponse;
                    } else if(identityAttributesToHide && url.endsWith("/attributes")) {
                        customLog("Calling attributes..");
                        var jsonResponse = JSON.parse(res);
                        customLog('before: ' + JSON.stringify(jsonResponse));
                        var attributes = jsonResponse.attributes;
                        for (var i = attributes.length - 1; i >= 0; i--) {
                            for (let identityAttributeToHide of identityAttributesToHide.split(',')) {
                                if (((attributes[i].attributeName) && (attributes[i].attributeName === identityAttributeToHide.trim()))) {
                                    customLog("removing - " + JSON.stringify(attributes.splice(i, 1)));
                                    break;
                                }
                            }
                        }
                        jsonResponse.attributes = attributes;
                        res = jsonResponse;
                    }
                    this.response = this.response = res;
                });
                return oldXHROpen.apply(this, arguments);
            }
        }

        const domObserver = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                customLog("Starting Iterating mutationList...");
                customLog("Mutation type - " + mutation.type);
                customLog("addedNodes - " + mutation.addedNodes);
                customLog("attributeName - " + mutation.attributeName);
                customLog("nextSibling - " + mutation.nextSibling);
                customLog("removedNodes  - " + mutation.removedNodes);
                customLog("target   - " + mutation.target);
                for (let added of mutation.addedNodes) {
                    customLog("added - " + added.outerHTML);
                }
                for (let removed of mutation.removedNodes) {
                    customLog("removed - " + removed.outerHTML);
                }
                if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
                    if (mutation.removedNodes[0].outerHTML && mutation.removedNodes[0].outerHTML.includes("Loading Data ...")) {
                        identityDetailsTweaksObserverForMutation2("tbody").then((elm) => {
                            domObserver2.observe($("tbody")[0], { childList: true, subtree: true });
                            if (disableDetailsActionButton) {
                                customLog("Hiding Details Action Button");
                                jQuery("sp-details-button").remove();
                            }
                            if (disableEntLinks) {
                                customLog("Disabling Entitlement Links..");
                                for (let linkObj of $("span[ng-if='ctrl.isGroupAttribute()']")) {
                                    customLog("linkObj - " + linkObj);
                                    if (linkObj.childNodes[1].text)
                                        linkObj.replaceChild(document.createTextNode(linkObj.childNodes[1].text), linkObj.childNodes[1])
                                }
                            }
                        });
                    }
                }
                customLog("Exiting Iterating mutationList...");
            }
        });

        const domObserver2 = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                customLog("Starting Iterating mutationList...");
                customLog("Mutation type - " + mutation.type);
                customLog("addedNodes - " + mutation.addedNodes);
                customLog("attributeName - " + mutation.attributeName);
                customLog("nextSibling - " + mutation.nextSibling);
                customLog("removedNodes  - " + mutation.removedNodes);
                customLog("target   - " + mutation.target);
                for (let added of mutation.addedNodes) {
                    customLog("added - " + added.outerHTML);
                }
                for (let removed of mutation.removedNodes) {
                    customLog("removed - " + removed.outerHTML);
                }

                if (disableDetailsActionButton) {
                    customLog("Hiding Details Action Button");
                    jQuery("sp-details-button").remove();
                }
                if (disableEntLinks) {
                    customLog("Disabling Entitlement Links..");
                    for (let linkObj of $("span[ng-if='ctrl.isGroupAttribute()']")) {
                        customLog("linkObj - " + linkObj);
                        if (linkObj.childNodes[1].text)
                            linkObj.replaceChild(document.createTextNode(linkObj.childNodes[1].text), linkObj.childNodes[1])
                    }
                }
                customLog("Exiting Iterating mutationList...");
            }
            domObserver.observe(document.body, { childList: true, subtree: true });
        });
        identityDetailsTweaksObserverForMutation2("tbody").then((elm) => {
            domObserver2.observe($("tbody")[0], { childList: true, subtree: true });
            if (disableDetailsActionButton) {
                customLog("Hiding Details Action Button");
                jQuery("sp-details-button").remove();
            }
            if (disableEntLinks) {
                customLog("Disabling Entitlement Links..");
                for (let linkObj of $("span[ng-if='ctrl.isGroupAttribute()']")) {
                    customLog("linkObj - " + linkObj);
                    if (linkObj.childNodes[1].text)
                        linkObj.replaceChild(document.createTextNode(linkObj.childNodes[1].text), linkObj.childNodes[1])
                }
            }
        });

        identityDetailsTweaksObserverForMutation3(".identity-details-container").then((elm) => {
            domObserver2.observe($(".identity-details-container")[0], { childList: true, subtree: true });
            if (disableDetailsActionButton) {
                customLog("Hiding Details Action Button");
                jQuery("sp-details-button").remove();
            }
            if (disableEntLinks) {
                customLog("Disabling Entitlement Links..");
                for (let linkObj of $("span[ng-if='ctrl.isGroupAttribute()']")) {
                    customLog("linkObj - " + linkObj);
                    if (linkObj.childNodes[1].text)
                        linkObj.replaceChild(document.createTextNode(linkObj.childNodes[1].text), linkObj.childNodes[1])
                }
            }
        });
    } else {
        customLog("User is Admin, So skipping..");
    }
}

var debugMode = false;

const requestOptions = {
    method: 'GET',
    headers: {
        'X-XSRF-TOKEN': PluginHelper.getCsrfToken(),
    }
};

fetch(PluginHelper.getPluginRestUrl('IdentityDetailsTweaks/getConfiguration'), requestOptions).then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    if (response.status == 200) {
        return response.json();
    }
}).then(data => {
    identityDetailsTweaksExec(data);
}).catch(error => {
    console.error('Error:', error);
});

