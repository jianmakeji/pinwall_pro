var index = new Vue({
    el: '.index',
    data(){
        return{
            // 数据请求
            aoData:{limit:10,jobTag:1,offset:0,status:-1,userId:-1},
            dataList:[],
            scrollModel:true,
            searchValue:"",
            containerStyle:{
                minHeight:""
            },
            checkAllType:"default",
            checkOpenType:"text",
            checkCloseType:"text",
            checkMyType:"text",
            //右侧抽屉
            drawerShow:false,
            searchData:{limit:10,jobTag:1,offset:0,status:-1,userId:-1,keyword:""}
        }
    },
    methods: {
        checkAll(){
            this.checkAllType = "default";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "text";
            this.aoData.status = -1;
            this.aoData.userId = -1;
            this.aoData.offset = 0;
            this.searchData.status = -1;
            this.searchData.userId = -1;
            this.searchData.offset = 0;
            if (this.searchValue) {
                getSearchData(this, this.searchData);
            } else {
                getData(this, this.aoData);
            }

        },
        checkOpen(){
            this.checkAllType = "text";
            this.checkOpenType = "default";
            this.checkCloseType = "text";
            this.checkMyType = "text";
            this.aoData.status = 0;
            this.aoData.userId = -1;
            this.aoData.offset = 0;
            this.searchData.status = 0;
            this.searchData.userId = -1;
            this.searchData.offset = 0;
            if (this.searchValue) {
                getSearchData(this, this.searchData);
            } else {
                getData(this, this.aoData);
            }
        },
        checkClose(){
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "default";
            this.checkMyType = "text";
            this.aoData.status = 1;
            this.aoData.userId = -1;
            this.aoData.offset = 0;
            this.searchData.status = 1;
            this.searchData.userId = -1;
            this.searchData.offset = 0;
            if (this.searchValue) {
                getSearchData(this, this.searchData);
            } else {
                getData(this, this.aoData);
            }
        },
        /**
         * 由我创建
         * @return {[type]} [description]
         */
        checkMy(){
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "default";
            this.aoData.status = -1;
            this.aoData.userId = 0;
            this.aoData.offset = 0;
            this.searchData.status = -1;
            this.searchData.userId = 0;
            this.searchData.offset = 0;
            if (this.searchValue) {
                getSearchData(this, this.searchData);
            } else {
                getData(this, this.aoData);
            }
        },
        searchTopics(){
            let that = this;
            this.searchData.keyword = this.searchValue;
            this.searchData.offset = 0;
            getSearchData(this, this.searchData);
        },
        /**
         * [checkThisTopic 查看该作业荚]
         */
        checkThisTopic(id){
            window.location.href = config.viewUrl.workFolder.replace(":id",id);
        },
        /**
         * [uploadToTopic 上传作品至该作业荚]
         */
        uploadToTopic(id){
            window.location.href = config.viewUrl.uploadWork.replace(":id",id);
        },
        /**
         * 锁定该作业荚
         */
         cockThisTopic(id, status){
             let that = this;
             let topicStatus = "";
             if (status == 1) {
                 topicStatus = 0;
             } else {
                 topicStatus = 1;
             }
             $.ajax({
                 url: '/website/topics/'+id,
                 type: 'PUT',
                 data: {topicId: id,status:topicStatus},
                 success(res){
                     if (res.status == 200) {
                         that.$Notice.success({
                             title:res.data,
                             duration:1,
                             onClose(){
                                 if (that.searchValue) {
                                     getSearchData(that, that.searchData);
                                 } else {
                                     getData(that, that.aoData);
                                 }
                             }
                         });
                     } else {
                         that.$Notice.error({title:res.data});
                     }
                 }
             });
         },
        /**
         * [searchData 设置作业荚]
         */
        settingThisTopic(id){
            window.location.href = config.viewUrl.topicsUpdate.replace(":id",id);
        },
    },
    created(){
        let that = this;
        //老师点击我的作业荚
        let myTopics = new String();
        if (window.location.href.split("?")[1]) {
            myTopics = window.location.href.split("=")[1];
            this.aoData.userId = 0;
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "default";
        }

        getData(this, this.aoData);
    }
})

$(document).ready(function() {
    //每次刷新界面滚动条置顶
    $('html,body').animate({scrollTop:0});
    /**
     * 滚动条滚动监听
     */
    $(window).scroll(function() {
        if ($(document).scrollTop() >= $(document).height() - $(window).height() && index.scrollModel) {
            if (index.searchValue) {
                index.searchData.offset += 10;
                getMoreSearchData(index, index.searchData);
            } else {
                index.aoData.offset += 10;
                getMoreData(index, index.aoData);
            }
        }
    })
});

function getData(that, aoData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.getTopicAboutData,
        method:"GET",
        params:aoData
    }).then(function(res){
        if( res.body.status == 200){
            that.$Loading.finish();
            that.dataList = res.body.data.rows;
            if (that.dataList.length == res.body.data.count) {
                that.scrollModel = false;
            }else{
                that.scrollModel = true;
            }
            for(let i=0; i < that.dataList.length; i++){
                that.dataList[i].createAt = that.dataList[i].createAt.replace("T"," ").replace("000Z","创建");
                if(that.dataList[i].user.avatarUrl == null){
                    that.dataList[i].user.avatarUrl = config.default_profile;
                }
            }
        }else{
            that.$Loading.error();
            that.$Notice.error({title:res.data});
        }
    },function(err){
        that.$Loading.error();
    })
}
/**
 * 获取更多数据（滚动条触底）
 */
function getMoreData(that, aoData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.getTopicAboutData,
        method:"GET",
        params:aoData
    }).then(function(res){
        if( res.body.status == 200){
            that.$Loading.finish();
            that.dataList = that.dataList.concat(res.body.data.rows);
            if (that.dataList.length == res.body.data.count) {
                that.scrollModel = false;
            }else{
                that.scrollModel = true;
            }
            for(let i=0; i < that.dataList.length; i++){
                that.dataList[i].createAt = that.dataList[i].createAt.replace("T"," ").replace("000Z","创建");
                if(that.dataList[i].user.avatarUrl == null){
                    that.dataList[i].user.avatarUrl = config.default_profile;
                }
            }
        }else{
            that.$Loading.error();
            that.$Notice.error({title:res.data});
        }

    },function(err){
        that.$Loading.error();
    })
}
function getSearchData(that, searchData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.searchByKeywordsAndJobtag,
        method:"GET",
        params:searchData
    }).then(function(res){
        if( res.body.status == 200){
            that.$Loading.finish();
            that.dataList = res.body.data.rows;
            if (that.dataList.length == res.body.data.count) {
                that.scrollModel = false;
            }else{
                that.scrollModel = true;
            }
            for(let i=0; i < that.dataList.length; i++){
                that.dataList[i].createAt = that.dataList[i].createAt.replace("T"," ").replace("000Z","创建");
                if(that.dataList[i].user.avatarUrl == null){
                    that.dataList[i].user.avatarUrl = config.default_profile;
                }
            }
        }else{
            that.$Loading.error();
            that.$Notice.error({title:res.data});
        }

    },function(err){
        that.$Loading.error();
    })
}
function getMoreSearchData(that, searchData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.searchByKeywordsAndJobtag,
        method:"GET",
        params:searchData
    }).then(function(res){
        if( res.body.status == 200){
            that.$Loading.finish();
            that.dataList = that.dataList.concat(res.body.data.rows);
            if (that.dataList.length == res.body.data.count) {
                that.scrollModel = false;
            }else{
                that.scrollModel = true;
            }
            for(let i=0; i < that.dataList.length; i++){
                that.dataList[i].createAt = that.dataList[i].createAt.replace("T"," ").replace("000Z","创建");
                if(that.dataList[i].user.avatarUrl == null){
                    that.dataList[i].user.avatarUrl = config.default_profile;
                }
            }
        }else{
            that.$Loading.error();
            that.$Notice.error({title:res.data});
        }
    },function(err){
        that.$Loading.error();
    })
}
