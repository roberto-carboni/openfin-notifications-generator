const title = document.getElementById("notification-title");
const category = document.getElementById("notification-category");
const body = document.getElementById("notification-body");
const icon = document.getElementById("notification-icon");
const indicatorType = document.getElementById("indicator-type");
const indicatorText = document.getElementById("indicator-text");
const hasCustomDisplayDate = document.getElementById(
  "notification-has-custom-display-date"
);
const customDisplayDate = document.getElementById(
  "notification-custom-display-date"
);
const customDisplayDateContainer = document.getElementById(
  "notification-custom-display-date-container"
);

const hasCustomIndicatorText = document.getElementById(
  "indicator-has-custom-text"
);
const customIndicatorTextContainer = document.getElementById(
  "indicator-custom-text-container"
);

const npmInstallAndBundle = document.getElementById("npm-install-and-bundle");

const hasCustomData = document.getElementById("notification-has-custom-data");
const customData = document.getElementById("notification-custom-data");
const customDataContainer = document.getElementById(
  "notification-custom-data-container"
);
const notificationExpires = document.getElementById("notification-expires");
const notificationExpiryDate = document.getElementById(
  "notification-expiry-date"
);
const notificationExpiryDateContainer = document.getElementById(
  "notification-expiry-date-container"
);

const addCloseAction = document.getElementById("add-close-action");
const addSelectAction = document.getElementById("add-select-action");
const addExpireAction = document.getElementById("add-expire-action");
const addExpireActionContainer = document.getElementById(
  "add-expire-action-container"
);
const addCustomButton1 = document.getElementById("add-custom-button-1");
const addCustomButton2 = document.getElementById("add-custom-button-2");
const addCustomButton3 = document.getElementById("add-custom-button-3");
const addCustomButton4 = document.getElementById("add-custom-button-4");

const button1Settings = document.getElementById("button1-settings-container");
const button2Settings = document.getElementById("button2-settings-container");
const button3Settings = document.getElementById("button3-settings-container");
const button4Settings = document.getElementById("button4-settings-container");

const code = document.getElementById("code");
const button1Title = document.getElementById("button1-title");
const button1Icon = document.getElementById("button1-icon");
const button1Type = document.getElementById("button1-type");
const button1OnClick = document.getElementById("button1-onclick");
const button1Data = document.getElementById("button1-data");
const button1DataContainer = document.getElementById("button1-data-container");

const button2Title = document.getElementById("button2-title");
const button2Icon = document.getElementById("button2-icon");
const button2Type = document.getElementById("button2-type");
const button2OnClick = document.getElementById("button2-onclick");
const button2Data = document.getElementById("button2-data");
const button2DataContainer = document.getElementById("button2-data-container");

const button3Title = document.getElementById("button3-title");
const button3Icon = document.getElementById("button3-icon");
const button3Type = document.getElementById("button3-type");
const button3OnClick = document.getElementById("button3-onclick");
const button3Data = document.getElementById("button3-data");
const button3DataContainer = document.getElementById("button3-data-container");

const button4Title = document.getElementById("button4-title");
const button4Icon = document.getElementById("button4-icon");
const button4Type = document.getElementById("button4-type");
const button4OnClick = document.getElementById("button4-onclick");
const button4Data = document.getElementById("button4-data");
const button4DataContainer = document.getElementById("button4-data-container");

const showAllNotifications = document.getElementById("show-all-notifications");
const allNotificationsData = document.getElementById("all-notifications-data");
const allNotificationDataContainer = document.getElementById(
  "all-notifications-data-container"
);

const createNotification = document.getElementById("create");
const clearLastNotification = document.getElementById("clear-last");
const clearAllNotifications = document.getElementById("clear-all");
const toggleCenter = document.getElementById("toggle-center");
const copycode = document.getElementById("copycode");

// we are using a script tag to pull in the library on the main page but if you are using rollup or webpack you may have done the same
// as the sample:
// import {create, addEventListener, clear, clearAll, getAll, toggleNotificationCenter, VERSION, provider} from 'openfin-notifications';
const {
  create,
  addEventListener,
  clear,
  clearAll,
  getAll,
  toggleNotificationCenter,
  VERSION,
  provider
} = notifications;

let alertQueue = [];
let alertShowing = false;
let colorMap = {
  "on-select": "success",
  "on-close": "danger",
  "on-expire": "warning",
  "button1-click": "primary",
  "button2-click": "secondary",
  "button3-click": "tertiary",
  "button4-click": "medium"
};
let titleMap = {
  "on-select": "The Notification Was Clicked",
  "on-close": "The Notification Closed",
  "on-expire": "The Notification Expired",
  "button1-click": "Button 1 Was Clicked",
  "button2-click": "Button 2 Was Clicked",
  "button3-click": "Button 3 Was Clicked",
  "button4-click": "Button 4 Was Clicked"
};

let lastNotificationId = Date.now() + "";

const isContainerVisible = (isVisible, containerElement) => {
  if (isVisible) {
    containerElement.style.display = "unset";
  } else {
    containerElement.style.display = "none";
  }
};

const processCustomData = (customData) => {
  let processedData;

  if (customData.value.trim().indexOf("{") === 0) {
    try {
      processedData = JSON.parse(customData.value);
    } catch (err) {
      console.log(
        "There was an error parsing the custom data. It is not a well formed json object."
      );
      processedData = {
        setting: "There was an error parsing the JSON in the textbox "
      };
    }
  } else if (customData.value !== "") {
    processedData = customData.value;
  }

  return processedData;
};

const buildButton = (
  buttonNumber,
  title,
  icon,
  buttonType,
  onSelectEnabled,
  data
) => {
  let definition = {};

  definition.title = title.value;
  definition.iconUrl = icon.value;
  definition.type = buttonType.value;
  if (onSelectEnabled.checked) {
    definition.onClick = {
      task: "button" + buttonNumber + "-click",
      customData: processCustomData(data)
    };
  }

  return definition;
};

const buildOptions = async () => {
  const options = {
    title: title.value,
    category: category.value,
    body: body.value,
    icon: icon.value
  };

  if (indicatorType.value !== "") {
    options.indicator = {
      type: indicatorType.value,
      text: indicatorText.value === "" ? undefined : indicatorText.value
    };
  }

  if (hasCustomDisplayDate.checked) {
    isContainerVisible(true, customDisplayDateContainer);
    options.date = new Date(customDisplayDate.value);
  } else {
    isContainerVisible(false, customDisplayDateContainer);
  }

  if (hasCustomIndicatorText.checked) {
    isContainerVisible(true, customIndicatorTextContainer);
  } else {
    indicatorText.value = "";
    isContainerVisible(false, customIndicatorTextContainer);
  }

  if (indicatorType.value !== "") {
    options.indicator = {
      type: indicatorType.value,
      text: indicatorText.value === "" ? undefined : indicatorText.value
    };
  }

  if (hasCustomData.checked) {
    options.customData = processCustomData(customData);
    isContainerVisible(true, customDataContainer);
  } else {
    isContainerVisible(false, customDataContainer);
  }

  if (notificationExpires.checked) {
    options.expires = new Date(notificationExpiryDate.value);
    isContainerVisible(true, notificationExpiryDateContainer);
  } else {
    isContainerVisible(false, notificationExpiryDateContainer);
  }

  if (addCloseAction.checked) {
    options.onClose = {
      task: "on-close",
      supportingData: {
        canBeAnything: "supportingData can be called anything other than task."
      }
    };
  }

  if (addSelectAction.checked) {
    options.onSelect = {
      task: "on-select",
      supportingData: {
        canBeAnything: "supportingData can be called anything other than task."
      }
    };
  }

  if (addExpireAction.checked) {
    options.onExpire = {
      task: "on-expire",
      supportingData: {
        canBeAnything: "supportingData can be called anything other than task."
      }
    };
  }

  if (
    addCustomButton1.checked ||
    addCustomButton2.checked ||
    addCustomButton3.checked ||
    addCustomButton4.checked
  ) {
    options.buttons = [];

    if (addCustomButton1.checked) {
      options.buttons.push(
        buildButton(
          1,
          button1Title,
          button1Icon,
          button1Type,
          button1OnClick,
          button1Data
        )
      );
    }

    if (addCustomButton2.checked) {
      options.buttons.push(
        buildButton(
          2,
          button2Title,
          button2Icon,
          button2Type,
          button2OnClick,
          button2Data
        )
      );
    }

    if (addCustomButton3.checked) {
      options.buttons.push(
        buildButton(
          3,
          button3Title,
          button3Icon,
          button3Type,
          button3OnClick,
          button3Data
        )
      );
    }

    if (addCustomButton4.checked) {
      options.buttons.push(
        buildButton(
          4,
          button4Title,
          button4Icon,
          button4Type,
          button4OnClick,
          button4Data
        )
      );
    }
  }

  return options;
};

const buildCodeSample = async () => {
  const options = await buildOptions();
  let codeSnippet = `
  // Make sure you have notifications enabled in your manifest/config file
  // by having a notifications entry in the services array (see below). 
  // Add "services" if it doesn't exist. It goes in the root of the config/manifest file. 
  
  // "services": [
  //  {
  //    "name": "notifications"
  //  }
  // ]
  `;

  if (npmInstallAndBundle.checked) {
    codeSnippet += `
  // You are using webpack/rollup/etc (BUNDLING) and have npm installed openfin-notifications  
  
  import {addEventListener, create} from 'openfin-notifications';
  `;
  } else {
    codeSnippet += `
  // You are not using bundling and you are adding openfin notifications via a script tag 
  // Add the following to your HTML:   
  
  // <script src="https://cdn.openfin.co/services/openfin/notifications/${VERSION}/openfin-notifications.js"></script>
    
  // Add this to your JavaScript to make addEventListener AND create available 
  // or use notifications.create and notifications.addEventListener:
    
  const {
    create,
    addEventListener,
  } = notifications;
  `;
  }

  codeSnippet += `
  // do this as part of your app initialisation/loading service and not based on some user interaction
  // as you want to be able to react to notifications if you relaunch your app and someone clicks on a 
  // notification (or if the notification relaunches your app):

  // when your code is initialised you can add functions to handle tasks (this would be done within your service)

  let taskRegistry = {
    default: (event)=> {
      console.log("Notification Task Id Not Supported: " + JSON.stringify(event));
    }
  }
  `;

  if (options.onClose !== undefined) {
    codeSnippet += `
  taskRegistry["on-close"] = (event) => {
    console.log("Notification onClose: " + JSON.stringify(event));
  };
    `;
  }

  if (options.onSelect !== undefined) {
    codeSnippet += `
  taskRegistry["on-select"] = (event) => {
    console.log("Notification onSelect: " + JSON.stringify(event));
  };
    `;
  }

  if (options.onExpire !== undefined) {
    codeSnippet += `
  taskRegistry["on-expire"] = (event) => {
    console.log("Notification onExpire: " + JSON.stringify(event));
  };
    `;
  }

  if (options.buttons !== undefined && options.buttons.length > 0) {
    const button1Exists = (button) =>
      button.onClick !== undefined && button.onClick.task.indexOf("1") > -1;
    const button2Exists = (button) =>
      button.onClick !== undefined && button.onClick.task.indexOf("2") > -1;
    const button3Exists = (button) =>
      button.onClick !== undefined && button.onClick.task.indexOf("3") > -1;
    const button4Exists = (button) =>
      button.onClick !== undefined && button.onClick.task.indexOf("4") > -1;

    if (options.buttons.some(button1Exists)) {
      codeSnippet += `
  taskRegistry["button1-click"] = (event) => {
    console.log("Notification Button 1 Clicked: " + JSON.stringify(event));
  };
    `;
    }

    if (options.buttons.some(button2Exists)) {
      codeSnippet += `
  taskRegistry["button2-click"] = (event) => {
    console.log("Notification Button 2 Clicked: " + JSON.stringify(event));
  };
    `;
    }

    if (options.buttons.some(button3Exists)) {
      codeSnippet += `
  taskRegistry["button3-click"] = (event) => {
    console.log("Notification Button 3 Clicked: " + JSON.stringify(event));
  };
    `;
    }

    if (options.buttons.some(button4Exists)) {
      codeSnippet += `
  taskRegistry["button4-click"] = (event) => {
    console.log("Notification Button 4 Clicked: " + JSON.stringify(event));
  };
    `;
    }
  }

  let dateTarget;
  let dateReplacement;
  let expiryDateTarget;
  let expiryDateReplacement;

  if (options.date !== undefined) {
    dateTarget = '"date": ' + JSON.stringify(options.date);
    dateReplacement = '"date": new Date(' + JSON.stringify(options.date) + ")";
  }

  if (options.expires !== undefined) {
    expiryDateTarget = '"expires": ' + JSON.stringify(options.expires);
    expiryDateReplacement =
      '"expires": new Date(' + JSON.stringify(options.expires) + ")";
  }

  codeSnippet += `
  addEventListener('notification-action', (event) => {
    // you would put your custom logic here. For now we just log it to the console.
    // Example registry of actions where you assign functions against a task
    let taskHandler = taskRegistry[event.result.task];
    if(taskHandler !== undefined) {
        taskHandler(event); 
    } else {
        taskRegistry.default(event);
    }
  });

  // if you are interested in the creation of your notifications (e.g. for auditing purposes) you can listen for that as well
  
  addEventListener("notification-created", async event => {
    // you would put your custom logic here. For now we just log it to the console.
    console.log("Notification created: " + JSON.stringify(event));
  });

  const notification = ${JSON.stringify(options, undefined, 4)};

  create(notification);
  `;

  if (dateTarget !== undefined) {
    codeSnippet = codeSnippet.replace(dateTarget, dateReplacement);
  }

  if (expiryDateTarget !== undefined) {
    codeSnippet = codeSnippet.replace(expiryDateTarget, expiryDateReplacement);
  }

  code.innerText = codeSnippet;
};

const initListeners = () => {
  title.addEventListener("ionChange", buildCodeSample);

  category.addEventListener("ionChange", buildCodeSample);

  body.addEventListener("ionChange", buildCodeSample);

  icon.addEventListener("ionChange", buildCodeSample);

  indicatorType.addEventListener("ionChange", buildCodeSample);

  indicatorText.addEventListener("ionChange", buildCodeSample);

  hasCustomDisplayDate.addEventListener("ionChange", buildCodeSample);

  customDisplayDate.addEventListener("ionChange", buildCodeSample);

  hasCustomIndicatorText.addEventListener("ionChange", buildCodeSample);

  npmInstallAndBundle.addEventListener("ionChange", buildCodeSample);

  hasCustomData.addEventListener("ionChange", buildCodeSample);

  customData.addEventListener("ionChange", buildCodeSample);

  notificationExpires.addEventListener("ionChange", async () => {
    isContainerVisible(notificationExpires.checked, addExpireActionContainer);

    if (!notificationExpires.checked) {
      addExpireAction.checked = false;
    }
    await buildCodeSample();
  });

  notificationExpiryDate.addEventListener("ionChange", buildCodeSample);

  addCloseAction.addEventListener("ionChange", buildCodeSample);

  addSelectAction.addEventListener("ionChange", buildCodeSample);

  addExpireAction.addEventListener("ionChange", buildCodeSample);

  addCustomButton1.addEventListener("ionChange", async () => {
    isContainerVisible(addCustomButton1.checked, button1Settings);
    await buildCodeSample();
  });

  addCustomButton2.addEventListener("ionChange", async () => {
    isContainerVisible(addCustomButton2.checked, button2Settings);
    await buildCodeSample();
  });

  addCustomButton3.addEventListener("ionChange", async () => {
    isContainerVisible(addCustomButton3.checked, button3Settings);
    await buildCodeSample();
  });

  addCustomButton4.addEventListener("ionChange", async () => {
    isContainerVisible(addCustomButton4.checked, button4Settings);
    await buildCodeSample();
  });

  button1Title.addEventListener("ionChange", buildCodeSample);
  button1Icon.addEventListener("ionChange", buildCodeSample);
  button1Type.addEventListener("ionChange", buildCodeSample);
  button1OnClick.addEventListener("ionChange", async () => {
    isContainerVisible(button1OnClick.checked, button1DataContainer);
    await buildCodeSample();
  });
  button1Data.addEventListener("ionChange", buildCodeSample);
  button2Title.addEventListener("ionChange", buildCodeSample);
  button2Icon.addEventListener("ionChange", buildCodeSample);
  button2Type.addEventListener("ionChange", buildCodeSample);
  button2OnClick.addEventListener("ionChange", async () => {
    isContainerVisible(button2OnClick.checked, button2DataContainer);
    await buildCodeSample();
  });
  button2Data.addEventListener("ionChange", buildCodeSample);

  button3Title.addEventListener("ionChange", buildCodeSample);
  button3Icon.addEventListener("ionChange", buildCodeSample);
  button3Type.addEventListener("ionChange", buildCodeSample);
  button3OnClick.addEventListener("ionChange", async () => {
    isContainerVisible(button3OnClick.checked, button3DataContainer);
    await buildCodeSample();
  });
  button3Data.addEventListener("ionChange", buildCodeSample);
  button4Title.addEventListener("ionChange", buildCodeSample);
  button4Icon.addEventListener("ionChange", buildCodeSample);
  button4Type.addEventListener("ionChange", buildCodeSample);
  button4OnClick.addEventListener("ionChange", async () => {
    isContainerVisible(button4OnClick.checked, button4DataContainer);
    await buildCodeSample();
  });
  button4Data.addEventListener("ionChange", buildCodeSample);

  showAllNotifications.addEventListener("ionChange", async () => {
    let show = showAllNotifications.checked;

    isContainerVisible(show, allNotificationDataContainer);

    if (show) {
      let list = await getAll();
      allNotificationsData.value = JSON.stringify(list, undefined, 4);
    }
  });
};

const presentToast = async (alert, doc) => {
  alertShowing = true;
  const toast = doc.createElement("ion-toast");

  if (alert.notificationType === "notification-action") {
    toast.message = `
    NoticationId: ${alert.notificationId}
    Source UUID: ${alert.source.uuid}
    Source Type: ${alert.source.type} 
    Trigger: ${alert.trigger}
    Control Info: ${alert.hasControl}
    Custom Data: ${JSON.stringify(alert.customData, undefined, 4)}`;
    toast.header = titleMap[alert.actionId];
    toast.color = colorMap[alert.actionId];
  }

  if (alert.notificationType === "notification-created") {
    toast.message = `
    NoticationId: ${alert.notificationId}`;
    toast.header = "Notification Created";
    toast.color = "dark";
  }

  toast.duration = 10000;

  toast.buttons = [
    {
      text: "Dismiss",
      role: "dismiss",
      handler: () => {
        console.log("Dismiss clicked");
      }
    }
  ];

  doc.body.appendChild(toast);

  toast.onDidDismiss().then(() => {
    alertShowing = false;
    if (alertQueue.length > 0) {
      let alert = alertQueue.shift();
      presentToast(alert, doc);
    }
  });
  return await toast.present();
};

const buildAlert = (notificationEvent) => {
  let alert = {};
  alert.notificationType = notificationEvent.type;

  if (notificationEvent.result !== undefined) {
    alert.actionId = notificationEvent.result.task;
    alert.customData = notificationEvent.result.customData;
    alert.source = {
      uuid: notificationEvent.source.identity.uuid,
      type: notificationEvent.source.type
    };
  }

  if (notificationEvent.notification !== undefined) {
    alert.notificationId = notificationEvent.notification.id;
  }

  alert.trigger = notificationEvent.trigger;
  alert.hasControl = notificationEvent.control !== undefined;
  return alert;
};

const initNotificationListener = () => {
  const doc = document;

  addEventListener("notification-created", async (event) => {
    const alert = buildAlert(event);
    if (alertShowing) {
      alertQueue.push(alert);
    } else {
      await presentToast(alert, doc);
    }

    console.log("Notification created: " + JSON.stringify(alert));
  });

  addEventListener("notification-action", async (event) => {
    const alert = buildAlert(event);
    if (alertShowing) {
      alertQueue.push(alert);
    } else {
      await presentToast(alert, doc);
    }

    console.log("Notification action triggered: " + JSON.stringify(alert));
  });
};

const initVersioningInfo = async () => {
  setTimeout(async () => {
    document.getElementById("lib-version").innerText = VERSION;
    let status = await provider.getStatus();
    document.getElementById("service-version").innerText = status.version;
    document.getElementById("service-connected").innerText = status.connected;
  }, 10000);
};

const setDefaults = () => {
  let expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1);
  notificationExpiryDate.value = expiryDate.toISOString();
  customDisplayDate.value = new Date().toISOString();
};

const init = async () => {
  isContainerVisible(false, button1Settings);
  isContainerVisible(false, button2Settings);
  isContainerVisible(false, button3Settings);
  isContainerVisible(false, button4Settings);
  isContainerVisible(false, button1DataContainer);
  isContainerVisible(false, button2DataContainer);
  isContainerVisible(false, button3DataContainer);
  isContainerVisible(false, button4DataContainer);
  isContainerVisible(false, addExpireActionContainer);
  isContainerVisible(false, allNotificationDataContainer);
  setDefaults();
  buildCodeSample();
  initListeners();
  initNotificationListener();
  initVersioningInfo();
};

createNotification.onclick = async () => {
  console.log("Apply clicked");
  let notification = await buildOptions();
  lastNotificationId = Date.now() + "";
  notification.id = lastNotificationId;
  create(notification);
};

clearLastNotification.onclick = async () => {
  console.log(
    "Clear Last Notification Clicked. Clearing: " + lastNotificationId
  );
  clear(lastNotificationId);
};

clearAllNotifications.onclick = async () => {
  console.log("Clear All Notifications Clicked. ");
  clearAll();
};

toggleCenter.onclick = async () => {
  console.log("Toggle Notification Center Clicked. ");
  toggleNotificationCenter();
};

copycode.onclick = () => {
  fin.Clipboard.writeText({
    data: code.innerText
  })
    .then(() => console.log("Code on clipboard"))
    .catch((err) => console.log(err));
};

window.addEventListener("DOMContentLoaded", (event) => {
  init();
});
