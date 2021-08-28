const BASE_URL = "https://adhelper.prios.net";

new Vue({
  el: "#wrapper",
  mounted() {
    console.log("Mounted");

    this.getStorageValue("token").then((storageToken) => {
      this.storageToken = storageToken;
    });

    window.addEventListener(
      "message",
      async (event) => {
        console.log(event.data);

        let { data } = event;

        if (data.type == "config") {
          this.showAds = data.showAds;
          this.autoScroll = data.autoScroll;

          if (data.uid)
            this.uid = data.uid;

          this.onFBTab = true;
        }
      },
      false
    );

    this.sendMessageToInjectedScript({
      type: "getStatus",
    });

    setInterval(() => {
      this.updateCounters();
    }, 100);

    this.getToken().then((token) => {
      this.token = token;
    });

    this.triggerResize();
  },
  updated() {
    this.triggerResize();
  },
  data() {
    return {
      showAds: false,
      autoScroll: false,
      viewedAdsCount: 0,
      advertiserCount: 0,
      dailyViewedAdsCount: 0,
      dailyAdvertiserCount: 0,
      onFBTab: false,
      favoriteCount: 0,
      dailyFavoriteCount: 0,
      token: null,
      adsAccounts: [],
      threshold: {},
      preview: true,
      page: 1,
      storageToken: null,
      uid: null
    };
  },
  methods: {
    sendMessageToInjectedScript(obj) {
      return window.parent.postMessage(obj, "*");
    },
    changeConfigOnInjectedScript(obj) {
      this.sendMessageToInjectedScript({
        type: "changeConfig",
        ...obj,
      });
    },
    resize(height) {
      this.sendMessageToInjectedScript({
        type: "resize",
        height,
      });
    },
    close() {
      this.sendMessageToInjectedScript({
        type: "close",
      });

      window.close();
    },
    flipShowAds() {
      this.changeConfigOnInjectedScript({
        showAds: !this.showAds,
      });
    },
    flipAutoScroll() {
      this.changeConfigOnInjectedScript({
        autoScroll: !this.autoScroll
      });
    },
    getStorageValue(key) {
      return new Promise((cb) => {
        chrome.storage.local.get([key], (data) => {
          if (data[key]) cb(data[key]);

          cb(0);
        });
      });
    },
    updateCounters() {
      this.getStorageValue("viewedAdsCount").then(
        (count) => (this.viewedAdsCount = count)
      );

      this.getStorageValue("advertiserCount").then(
        (count) => (this.advertiserCount = count)
      );

      this.getStorageValue("favoriteCount").then(
        (count) => (this.favoriteCount = count)
      );

      this.getStorageValue("dailyViewedAdsCount").then(
        (count) => (this.dailyViewedAdsCount = count)
      );

      this.getStorageValue("dailyAdvertiserCount").then(
        (count) => (this.dailyAdvertiserCount = count)
      );

      this.getStorageValue("dailyFavoriteCount").then(
        (count) => (this.dailyFavoriteCount = count)
      );
    },
    isFBUrl(url) {
      return /https:\/\/www\.facebook\.com/.exec(url);
    },
    async getToken() {
      let res = await fetch(
        "https://business.facebook.com/business_locations/"
      );
      let text = await res.text();
      let token = /\["(EAA.*?)"/.exec(text);

      return token?.[1] || null;
    },
    async getAdsAccounts(token) {
      let res = await fetch(
        `https://graph.facebook.com/v10.0/me/adaccounts?fields=account_id,adspaymentcycle,currency,am_tabular.date_preset(maximum).column_fields(spend),name,adtrust_dsl,account_status,is_prepay_account&limit=5000&access_token=${token}`
      );
      let json = await res.json();

      return json;
    },
    calculateTotalSpent(account) {
      let data = account?.am_tabular?.data || [];

      // console.log({ data });

      let res = data.reduce((curr, item) => {
        let rows = item?.rows || [];

        // console.log({ rows });

        return (
          curr +
          rows.reduce((curr, row) => {
            let atomicValues = row?.atomic_values || [];

            // console.log({ atomicValues });

            return (
              curr +
              atomicValues.reduce((curr, item) => {
                // console.log({ item });

                return curr + parseFloat(item);
              }, 0)
            );
          }, 0)
        );
      }, 0);

      return res.toLocaleString();
    },
    async getThreshold(account, token) {
      let res = await fetch("https://graph.facebook.com/graphql", {
        method: "POST",
        body: `doc_id=3633949436715463&variables=${JSON.stringify({
          paymentAccountID: account.account_id,
        })}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Authorization: `OAuth ${token}`,
        },
      });

      let json = await res.json();

      let threshold =
        json.data?.billable_account_by_payment_account
          ?.billing_threshold_currency_amount?.formatted_amount ||
        json.data?.billable_account_by_payment_account?.prepay_balance
          ?.formatted_amount;

      return threshold || "Lỗi";
    },
    viewMore() {
      this.preview = !this.preview;

      // $(".popup-main").slideToggle(() => {
      //   if ($(".popup-main").is(":hidden")) {
      //     $(".btn-view").find("span").html("View Less");
      //     $(".btn-view")
      //       .find("i")
      //       .removeClass("bi-chevron-down")
      //       .addClass("bi-chevron-up");
      //   } else {
      //     $(".btn-view").find("span").html("View More");
      //     $(".btn-view")
      //       .find("i")
      //       .removeClass("bi-chevron-up")
      //       .addClass("bi-chevron-down");
      //   }

      //   this.triggerResize();
      // });

      this.triggerResize();
    },
    triggerResize() {
      window.document.documentElement.querySelector("#wrapper").scrollHeight;

      this.$nextTick(() => {
        this.resize(
          window.document.documentElement.querySelector("#wrapper").scrollHeight
        );
      });
    },
    switchPage(page) {
      this.page = page;
    },
    seeCollectedAds() {
      window.open(`${BASE_URL}/?token=${this.extensionToken}`);
    }
  },
  watch: {
    async token(newToken) {
      if (!newToken) this.adsAccounts = [];

      let json = await this.getAdsAccounts(newToken);

      let data = json?.data || [];

      this.threshold = {};

      // For testing
      // for (let item of data) {
      //   data.push(item);

      //   if (data.length >= 20)
      //     break;
      // }

      await Promise.all(
        data.map(async (account) => {
          if (account?.is_prepay_account || account?.adspaymentcycle) {
            let threshold = await this.getThreshold(account, this.token);

            // console.log({ id: account.account_id, threshold });

            this.threshold[account.account_id] = threshold;
          }
        })
      );

      this.adsAccounts = data;

      this.triggerResize();
    },
  },
  computed: {
    computedAdsAccounts() {
      let res = [];

      if (this.preview) {
        for (let i = 0; i < Math.min(3, this.adsAccounts.length); i++)
          res.push(this.adsAccounts[i]);
      } else {
        for (
          let i = (this.page - 1) * 10;
          i < Math.min(this.page * 10, this.adsAccounts.length);
          i++
        )
          res.push(this.adsAccounts[i]);
      }

      return res;
    },
    extensionToken() {
      if (!this.uid || !this.storageToken)
        return null;

      return `${this.uid}_${this.storageToken}`;
    }
  },
});
