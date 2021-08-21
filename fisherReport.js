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

  function patch(moduleName, that, args, patchFunction, patchPath = ["default"]) {
    if (args[0] == moduleName) {
      console.log(args);

      const orig = args[2];

      args[2] = function (a, b, c, d, e, f, g, h) {
        let res = orig.apply(that, arguments);

        for (let i = arguments.length - 1; i >= 0; i--) {
          let current = arguments[i];
          let ok = true;

          for (let i = 0; i < patchPath.length - 1; i++) {
            if (!current?.[patchPath[i]]) {
              ok = false;
              break;
            }

            debug(patchPath[i]);

            current = current[patchPath[i]];
          }

          let lastKey = patchPath[patchPath.length - 1];

          if (!ok || !current[lastKey])
            continue;

          debug(current);

          const origFunction = current[lastKey];

          current[lastKey] = function () {
            return patchFunction(origFunction, this, arguments);
          };

          debug(arguments);

          break;
        }

        return res;
      };
    }
  }

  function patchMessageActions(origFunction, that, args) {
    // debugger;
    
    // let res = require('react').jsx(require("MWV2MessageActions.bs").FocusRing.make, args[0]);

    let res = origFunction.apply(that, args);

    if (res?.type) {
      res.type = require("MWV2MessageActions.bs").FocusRing.make;
    }

    debug({ patchMessageActionsRes: res });

    return res;
  }

  function patchMessageActionsFocusRing(origFunction, that, args) {
    // debugger;

    // let res = require("react").jsx(
    //   require("MWV2MessageActions.bs").MenuState.make,
    //   args[0]
    // );

    let res = origFunction.apply(that, args);

    if (res?.type) {
      res.type = require("MWV2MessageActions.bs").MenuState.make;
    }

    return res;
  }

  function patchMessageActionsMenuState(origFunction, that, args) {
    // debugger;

    // let a = args[0];

    // let f = require('react').useState(function() {
    //   return !1;
    // });

    // let g = require("react").useState(function () {
    //   return !1;
    // });

    // let h = require("LSBitFlag.bs").has(
    //   require("LSMessageContentType.bs").mediaPreview,
    //   a.message.Q
    // );

    // let j = function(a) {};

    // let d = a.hovered || a.focused || f[0] || g[0];

    // let res = null;

    // if (d || h) {
    //   res = require("react").jsx(
    //     require("MWV2MessageActions.bs").ActionsRow.make,
    //     {
    //       message: a.message,
    //       outgoing: a.outgoing,
    //       setMoreMenuOpen: g[1],
    //       setReactionsMenuOpen: f[1],
    //       interactedWith: d,
    //       alwaysShowForwardForMediaMessages: h,
    //       closeActionsMenu: j,
    //     }
    //   );
    // }

    let res = origFunction.apply(that, args);

    if (res?.type)
      res.type = require("MWV2MessageActions.bs").ActionsRow.make;

    return res;
  }

  function patchMessageActionsRow(origFunction, that, args) {
    // debugger;

    let res = origFunction.apply(that, args);

    let b = require("fbt")._("Report");

    let react = require('react');

    let message = args[0];

    let i = require("stylex");
    i.inject(
      ".kmwttqpk{margin-left:0}",
      1,
      ".kmwttqpk{margin-right:0}"
    );
    i.inject(".l7ghb35v{margin-right:0}", 1, ".l7ghb35v{margin-left:0}");
    i.inject(".mx6bq00g{width:24px}", 1);
    i.inject(".mwtcrujb{height:24px}", 1);
    i.inject(".alzwoclg{display:flex}", 1);
    i.inject(
      ".qmqpeqxj{border-top-left-radius:50%}",
      1,
      ".qmqpeqxj{border-top-right-radius:50%}"
    );
    i.inject(
      ".e7u6y3za{border-top-right-radius:50%}",
      1,
      ".e7u6y3za{border-top-left-radius:50%}"
    );
    i.inject(
      ".qwcclf47{border-bottom-right-radius:50%}",
      1,
      ".qwcclf47{border-bottom-left-radius:50%}"
    );
    i.inject(
      ".nmlomj2f{border-bottom-left-radius:50%}",
      1,
      ".nmlomj2f{border-bottom-right-radius:50%}"
    );
    i.inject(".jez8cy9q{flex-shrink:0}", 1);
    i.inject(".jtronmds{align-content:center}", 1);
    i.inject(".i85zmo3j{align-items:center}", 1);
    i.inject(".jcxyg2ei{justify-content:center}", 1);
    i.inject(".hsphh064{text-align:center}", 1);
    i.inject(".fsf7x5fv{cursor:pointer}", 1);
    i.inject(".qudkkb1i:hover{background-color:var(--press-overlay)}", 8);
    i.inject(".om3e55n1{position:relative}", 1);
    i.inject(".epnzikpj{height:22px}", 1);
    i.inject(".kmdng2my{width:22px}", 1);
    i.inject(".fupido9q{opacity:.6}", 1);
    i.inject(".l7ofbhzv:active{opacity:1}", 10);
    i.inject(".beiy8v6c:hover{opacity:1}", 8);

    let k = {
      action: {
        marginStart: "kmwttqpk",
        marginEnd: "l7ghb35v",
        width: "mx6bq00g",
        height: "mwtcrujb",
        display: "alzwoclg",
        borderTopStartRadius: "qmqpeqxj",
        borderTopEndRadius: "e7u6y3za",
        borderBottomEndRadius: "qwcclf47",
        borderBottomStartRadius: "nmlomj2f",
        flexShrink: "jez8cy9q",
        alignContent: "jtronmds",
        alignItems: "i85zmo3j",
        justifyContent: "jcxyg2ei",
        textAlign: "hsphh064",
        cursor: "fsf7x5fv",
        ":hover": {
          backgroundColor: "qudkkb1i",
        },
        position: "om3e55n1",
      },
      icon: {
        height: "epnzikpj",
        width: "kmdng2my",
        opacity: "fupido9q",
        ":active": {
          opacity: "l7ofbhzv",
        },
        ":hover": {
          opacity: "beiy8v6c",
        },
      },
    };

    let h = require("stylex");
    
    h.inject(".az303tco{fill:var(--placeholder-icon)}", 1);

    let j = {
      icon: {
        fill: "az303tco"
      }
    };

    let svgIconElem = react.jsx("g", {
      strokeWidth: "1",
      fillRule: "evenodd",
      className: (h || (h = require("stylex")))(j.icon),
      children: [
        react.jsx("path", {
          d: "M243.225,333.382c-13.6,0-25,11.4-25,25s11.4,25,25,25c13.1,0,25-11.4,24.4-24.4C268.225,344.682,256.925,333.382,243.225,333.382z"
        }),
        react.jsx("path", {
          d: "M474.625,421.982c15.7-27.1,15.8-59.4,0.2-86.4l-156.6-271.2c-15.5-27.3-43.5-43.5-74.9-43.5s-59.4,16.3-74.9,43.4l-156.8,271.5c-15.6,27.3-15.5,59.8,0.3,86.9c15.6,26.8,43.5,42.9,74.7,42.9h312.8C430.725,465.582,458.825,449.282,474.625,421.982z M440.625,402.382c-8.7,15-24.1,23.9-41.3,23.9h-312.8c-17,0-32.3-8.7-40.8-23.4c-8.6-14.9-8.7-32.7-0.1-47.7l156.8-271.4c8.5-14.9,23.7-23.7,40.9-23.7c17.1,0,32.4,8.9,40.9,23.8l156.7,271.4C449.325,369.882,449.225,387.482,440.625,402.382z"
        }),
        react.jsx("path", {
          d: "M237.025,157.882c-11.9,3.4-19.3,14.2-19.3,27.3c0.6,7.9,1.1,15.9,1.7,23.8c1.7,30.1,3.4,59.6,5.1,89.7c0.6,10.2,8.5,17.6,18.7,17.6c10.2,0,18.2-7.9,18.7-18.2c0-6.2,0-11.9,0.6-18.2c1.1-19.3,2.3-38.6,3.4-57.9c0.6-12.5,1.7-25,2.3-37.5c0-4.5-0.6-8.5-2.3-12.5C260.825,160.782,248.925,155.082,237.025,157.882z"
        }),
      ],
    })

    debug({ svgIconElem });
    
    let elem = react.jsx(require("MWPTooltip.react"), {
      tooltip: b,
      align: "middle",
      position: "above",
      children: react.jsx("div", {
        className: (i || (i = require("stylex")))(k.action),
        children: react.jsx(require("CometPressable.react"), {
          "aria-label": b,
          testid: "messenger_report_menu_button",
          onPress: function (a) {
            console.log("Report button pressed", message);
          },
          overlayDisabled: !0,
          children: react.jsx("div", {
            className: i(k.icon),
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

    debug({ actionsRowRes: res });

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
  ];
})();