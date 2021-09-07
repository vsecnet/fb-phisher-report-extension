let listenerId = Date.now() + "";
const pattern = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.type == 'messageReport') {
    console.log(message);

    let { content, senderId, timestamp } = message.message;

    let matches = [...content.matchAll(pattern)];

    let urls = matches.map(item => item[0]);

    console.log(urls);

    let result = await fetch("http://103.245.249.136/phishingreport/submit", {
      method: 'POST',
      body: JSON.stringify({
        source: "FacebookMessenger",
        sender: senderId,
        content: urls,
        sendAt: timestamp,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json())
    .then(result => {
      console.log(result);

      chrome.notifications.create({
        message: chrome.i18n.getMessage("reportMessage"),
        title: chrome.i18n.getMessage("appName"),
        type: "basic",
        iconUrl: chrome.extension.getURL("icons/icon_128.png"),
      });
    })
    .catch(err => {
      chrome.notifications.create({
        message: chrome.i18n.getMessage("reportMessageFail"),
        title: chrome.i18n.getMessage("appName"),
        type: "basic",
        iconUrl: chrome.extension.getURL("icons/icon_128.png"),
      });
    })
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