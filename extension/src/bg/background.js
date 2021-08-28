let listenerId = Date.now() + "";
const pattern = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type == 'messageReport') {
    console.log(message);

    let matches = [...message.message.matchAll(pattern)];

    matches = matches.map(item => item[0]);

    console.log(matches);

    chrome.notifications.create({
      message: chrome.i18n.getMessage("reportMessage"),
      title: chrome.i18n.getMessage("appName"),
      type: "basic",
      iconUrl: chrome.extension.getURL("icons/icon_128.png"),
    });
  }
});

function setStorageValue(key, value) {
  return new Promise((cb) => {
    chrome.storage.local.set({ [key]: value }, () => cb());
  });
}

function getStorageValue(key) {
  return new Promise((cb) => {
    chrome.storage.local.get([key], (data) => {
      if (data[key]) cb(data[key]);

      cb(0);
    });
  });
}

function checkIfExistInStorage(key) {
  return new Promise((cb) => {
    chrome.storage.local.get([key], (data) => {
      if (data[key] != undefined) cb(true);

      cb(false);
    });
  });
}