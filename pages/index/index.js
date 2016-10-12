//index.js
//获取应用实例
var app = getApp();
var utils = require("../../utils/util.js");
var queryStr = "http://apis.baidu.com/showapi_open_bus/weixin/weixin_article_list";
var seprator = "?";
var params_page = "page=";
Page({
  data: {
    contentList: [],
    loading: true,
    isLoadingMore: false
  },
  //事件处理函数
  bindViewTap: function() {

  },
  scrolltoupper: function (e){
    console.log("scrolltoupper");
  },
  scrolltolower: function (e){

    if(this.data.isLoadingMore == false && this.data.loading == false){
      console.log("scrolltolower");
      this.loadmore(); 
    }
  },
  scrolling: function (e) {
    console.log("scrolling");
  },
  onLoad: function () {
    var that = this;
    // first request
    wx.request({
      url: queryStr,
      header:{
        'Content-Type': 'application/json',
        'apikey': '21150a4fe35d155727f4e5d574b56a02'
      },
      success: function(res){
        if(res.data.showapi_res_code == 0){
          let cl = res.data.showapi_res_body.pagebean.contentlist;
          cl.map((item) => item.date = item.date.substring(0,10));
          that.setData({
            loading: false,
            contentList: cl,
            currentPage: 1,
            nextPage: 2,
            allPages: res.data.showapi_res_body.pagebean.allPages
          });
          console.log("currentPage: 1");
        }else{
          console.log('ohh! something expected were happened');
        }
      },
      fail: function () {
        console.log("connecting failed");
      }
    })
  },
  loadmore: function () {
    // before loadmore
    var that = this;
    that.setData({
      isLoadingMore: true,
      loading: true
    });
    // todo loadmore
    if(that.data.currentPage < that.data.allPages){
        let query = queryStr+seprator+params_page+that.data.nextPage;
        wx.request({
          url: query,
          header:{
            'Content-Type': 'application/json',
            'apikey': '21150a4fe35d155727f4e5d574b56a02'
          },
          success: function (res){
            if(res.data.showapi_res_code == 0){
              let cl = res.data.showapi_res_body.pagebean.contentlist;
              cl.map((item) => item.date = item.date.substring(0,10));
              that.setData({
                contentList: that.data.contentList.concat(cl),
                currentPage: that.data.currentPage+1,
                nextPage: that.data.nextPage+1,
                allPages: res.data.showapi_res_body.pagebean.allPages
              });
              console.log("currentPage: "+that.data.currentPage);
            }else{
              console.log('ohh! something expected were happened');
            }
          },
          fail: function () {
            console.log("connecting failed");
          }
        })
    }
    // end of loadmore
    that.setData({
      isLoadingMore: false,
      loading: false
    })
  }
})
