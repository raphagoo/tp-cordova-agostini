function onBatteryStatus(status) {
    console.log("Battery Level " + status.level + "%");
}

const openInAppBrowserOptions = "location=yes,zoom=false";

const openInAppBrowser = (link) => {
    cordova.InAppBrowser.open(link, "_blank", openInAppBrowserOptions);
};

const deviceReady = () => {
    window.addEventListener("batterystatus", onBatteryStatus, false);
};
