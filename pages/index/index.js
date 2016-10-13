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
    isLoadingMore: false,
    firstLoading: true,
    hasMore: true,
    latestHintHidden: true
  },
  //事件处理函数
  bindViewTap: function() {

  },
  scrolltoupper: function (e){
    // console.log("scrolltoupper");
  },
  scrolltolower: function (e){
    if(this.data.isLoadingMore == false && this.data.loading == false){
      this.loadmore(); 
    }
  },
  scrolling: function (e) {
    // console.log("scrolling");
  },
  onPullDownRefresh: function() {
    // Do something when pull down
    this.refresh();
  },
  onLoad: function () {
    this.refresh();
    // var that = this;
    // first request
    // wx.request({
    //   url: queryStr,
    //   header:{
    //     'Content-Type': 'application/json',
    //     'apikey': '21150a4fe35d155727f4e5d574b56a02'
    //   },
    //   success: function(res){
    //     if(res.data.showapi_res_code == 0){
    //       let cl = res.data.showapi_res_body.pagebean.contentlist;
    //       cl.map((item) => item.date = item.date.substring(0, 10));
    //       that.setData({
    //         loading: false,
    //         firstLoading: false,
    //         contentList: cl,
    //         currentPage: 1,
    //         nextPage: 2,
    //         allPages: res.data.showapi_res_body.pagebean.allPages
    //       });
    //       console.log("currentPage: 1");
    //     }else{
    //       console.log('ohh! something expected were happened');
    //     }
    //   },
    //   fail: function () {
    //     console.log("connecting failed");
    //   }
    // })
  },
  refresh: function () {
    let that = this;
    var num = -1;
    var newItems = [];
    wx.request({
      url: queryStr,
      header:{
        'Content-Type': 'application/json',
        'apikey': '21150a4fe35d155727f4e5d574b56a02'
      },
      success: function(res){
        if(res.data.showapi_res_code == 0){
          let cl = res.data.showapi_res_body.pagebean.contentlist;
          if(that.data.firstLoading == true){
            cl.map((item) => item.date = item.date.substring(0, 10));
            that.setData({
              loading: false,
              firstLoading: false,
              contentList: cl,
              currentPage: 1,
              nextPage: 2,
              allPages: res.data.showapi_res_body.pagebean.allPages
            });
          }else {
            for(let j = 0;j < cl.lenght;j++){
              if(that.data.contentList[0].id !== cl[j].id){
                cl[j].date = cl[j].date.substring(0, 10);
                newItems.push(cl[j]);
              } else{
                break;
              }
            }
            // console.log("newItems lenght: "+newItems.length);
            if(newItems.length !== 0){
              that.setData({
                contentList: newItems.concat(that.data.contentList)
              });
            }else {
              // console.log("no changed");
              that.setData({
                latestHintHidden: false
              })
              setTimeout(function(){
                that.setData({
                  latestHintHidden: true
                })
              },1000);
            }
            wx.stopPullDownRefresh();
            // console.log("refreshing end");
          }
          // console.log("currentPage: 1");
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
    this.setData({
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
              // console.log("currentPage: "+that.data.currentPage);
            }else{
              console.log('ohh! something expected were happened');
            }
          },
          fail: function () {
            console.log("connecting failed");
          }
        })
    }else {
      that.setData({
        hasMore: false
      });
    }
    // end of loadmore
    that.setData({
      isLoadingMore: false,
      loading: false
    })
  }
})
