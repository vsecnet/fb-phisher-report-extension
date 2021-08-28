// ==UserScript==
// @name         FB Fisher Report
// @version      0.1
// @description  try to take over the world!
// @author       VSEC
// @match        https://www.facebook.com/
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  Object.defineProperty(window, "__d", {
    get() {
      return this.___d;
    },
    set(val) {
      this.___d = function () {
        for (let p of patches)
          patch(p.moduleName, this, arguments, p.f, p.patchPath);

        return val.apply(this, arguments);
      };
    },
  });

  function debug(obj) {
    // return;
    console.log(obj);
  }

  function patch(
    moduleName,
    that,
    args,
    patchFunction,
    patchPath = ["default"]
  ) {
    if (args[0] == moduleName) {
      const orig = args[2];

      args[2] = function() {
        let res = orig.apply(that, arguments);

        for (let i = arguments.length - 1; i >= 0; i--) {
          let current = arguments[i];
          let ok = true;

          for (let j = 0; j < patchPath.length - 1; j++) {
            if (!current?.[patchPath[j]]) {
              ok = false;
              break;
            }

            current = current[patchPath[j]];
          }

          let lastKey = patchPath[patchPath.length - 1];

          if (!ok || !current?.[lastKey]) continue;

          const origFunction = current[lastKey];

          current[lastKey] = function () {
            return patchFunction(origFunction, that, arguments);
          };

          break;
        }

        return res;
      };
    }
  }

  function patchMessageActions(origFunction, that, args) {
    let res = origFunction.apply(that, args);

    if (res?.type) {
      res.type = require("MWV2MessageActions.bs").FocusRing.make;
    }

    // debug({ patchMessageActionsRes: res });

    return res;
  }

  function patchMessageActionsFocusRing(origFunction, that, args) {
    let res = origFunction.apply(that, args);

    if (res?.type) {
      res.type = require("MWV2MessageActions.bs").MenuState.make;
    }

    return res;
  }

  function patchMessageActionsMenuState(origFunction, that, args) {
    let res = origFunction.apply(that, args);

    if (res?.type) res.type = require("MWV2MessageActions.bs").ActionsRow.make;

    return res;
  }

  function patchMessageActionsRow(origFunction, that, args) {
    // debugger;

    let res = origFunction.apply(that, args);

    let b = require("fbt")._("Report");

    let react = require("react");

    let message = args[0];

    let stylex = require("stylex");

    let MWV2ReplyButtonStyles = require("MWV2ReplyButton.bs").styles;
    let svgIconStyles = require("MDSReplyActionSvgIcon.bs").styles;

    let svgIconElem = react.jsx("g", {
      strokeWidth: "1",
      fillRule: "evenodd",
      className: stylex(svgIconStyles.icon),
      children: [
        react.jsx("path", {
          d: "M243.225,333.382c-13.6,0-25,11.4-25,25s11.4,25,25,25c13.1,0,25-11.4,24.4-24.4C268.225,344.682,256.925,333.382,243.225,333.382z",
        }),
        react.jsx("path", {
          d: "M474.625,421.982c15.7-27.1,15.8-59.4,0.2-86.4l-156.6-271.2c-15.5-27.3-43.5-43.5-74.9-43.5s-59.4,16.3-74.9,43.4l-156.8,271.5c-15.6,27.3-15.5,59.8,0.3,86.9c15.6,26.8,43.5,42.9,74.7,42.9h312.8C430.725,465.582,458.825,449.282,474.625,421.982z M440.625,402.382c-8.7,15-24.1,23.9-41.3,23.9h-312.8c-17,0-32.3-8.7-40.8-23.4c-8.6-14.9-8.7-32.7-0.1-47.7l156.8-271.4c8.5-14.9,23.7-23.7,40.9-23.7c17.1,0,32.4,8.9,40.9,23.8l156.7,271.4C449.325,369.882,449.225,387.482,440.625,402.382z",
        }),
        react.jsx("path", {
          d: "M237.025,157.882c-11.9,3.4-19.3,14.2-19.3,27.3c0.6,7.9,1.1,15.9,1.7,23.8c1.7,30.1,3.4,59.6,5.1,89.7c0.6,10.2,8.5,17.6,18.7,17.6c10.2,0,18.2-7.9,18.7-18.2c0-6.2,0-11.9,0.6-18.2c1.1-19.3,2.3-38.6,3.4-57.9c0.6-12.5,1.7-25,2.3-37.5c0-4.5-0.6-8.5-2.3-12.5C260.825,160.782,248.925,155.082,237.025,157.882z",
        }),
      ],
    });

    // debug({ svgIconElem });

    let elem = react.jsx(require("MWPTooltip.react"), {
      tooltip: b,
      align: "middle",
      position: "above",
      children: react.jsx("div", {
        className: stylex(MWV2ReplyButtonStyles.action),
        children: react.jsx(require("CometPressable.react"), {
          "aria-label": b,
          testid: "messenger_report_menu_button",
          onPress: function (a) {
            console.log("Report button pressed", message);
          },
          overlayDisabled: !0,
          children: react.jsx("div", {
            className: stylex(MWV2ReplyButtonStyles.icon),
            children: react.jsx("svg", {
              width: "22px",
              height: "22px",
              viewBox: "-50 -30 600 600",
              children: svgIconElem,
            }),
          }),
        }),
      }),
    });

    // let elem = react.createElement('div', {}, 'abc');

    let buffer = [];

    while (!buffer.length || !buffer[buffer.length - 1]) {
      buffer.push(res.props.children.pop());
    }

    res.props.children.push(elem);

    for (let i = buffer.length - 1; i >= 0; i--)
      res.props.children.push(buffer[i]);

    // debug({ actionsRowRes: res });

    return res;
  }

  function patchChatComposerActionTray(origFunction, that, args) {
    let trayButtons = args[0].trayButtons;

    console.log({ trayButtons });

    args[0].trayButtons.push(trayButtons[trayButtons.length - 1]);
    
    let res = origFunction.apply(that, args);

    return res;
  }

  const patches = [
    {
      moduleName: "MWV2MessageActions.bs",
      f: patchMessageActions,
      patchPath: ["make"],
    },
    {
      moduleName: "MWV2MessageActions.bs",
      f: patchMessageActionsFocusRing,
      patchPath: ["FocusRing", "make"],
    },
    {
      moduleName: "MWV2MessageActions.bs",
      f: patchMessageActionsMenuState,
      patchPath: ["MenuState", "make"],
    },
    {
      moduleName: "MWV2MessageActions.bs",
      f: patchMessageActionsRow,
      patchPath: ["ActionsRow", "make"],
    },
    {
      moduleName: "MWChatComposerActionTray.bs",
      f: patchChatComposerActionTray,
      patchPath: ["make"],
    },
  ];
})();
