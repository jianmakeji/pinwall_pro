Vue.use(VueLazyload)
var index = new Vue({
    el: '.index',
    data(){
        return{
            aoData:{limit:12,offset:0,userId:0,jobTag:0},
            aoUrl:"",
            userInfo:{userName:"",userTotal:""},
            headDataList:[],
            dataList:[],
            containerStyle:{
                minHeight:""
            },
            total:"",
            scrollModel:true,
            drawerShow:false
        }
    },
    created(){
        let that = this;

        let urlId = window.location.href.split("users/")[1].split("?")[0];
        if ( urlId == 0 ) {     //用户自己登录
            this.aoData.userId = 0;
            this.aoUrl = config.ajaxUrls.getPersonalJob;
        }else{
            this.aoData.userId = urlId;
            this.aoUrl = config.ajaxUrls.getPersonalJobByUserId;
        }
        this.aoData.jobTag = window.location.href.split("jobTag=")[1];
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";

        this.$Loading.start();
        $.ajax({
            url: this.aoUrl,
            type: 'GET',
            data: this.aoData,
            success:function(res){
                if (res.status == 200) {
                    that.$Loading.finish();
                    that.total = res.data.count;
                    if (res.data.count > 0){
                        that.userInfo = res.data.rows[0].user;
                        that.userInfo.createAt = that.userInfo.createAt.split("T")[0] + " 注册";
                        that.dataList = res.data.rows;
                        that.headDataList = res.data.rows;
                        if (that.dataList.length == res.data.count) {
                            that.scrollModel = false;
                        }else {
                            that.scrollModel = true;
                        }
                    }else{
                        that.userInfo.fullname = "此用户";
                        that.userInfo.avatarUrl = "";
                        that.userInfo.medalCount = 0;
                        that.$Notice.error({title:"用户暂无作品集！"})
                    }
                }else{
                    that.$Loading.error();
                    that.$Notice.error({title:res.data});
                }
            }
        })
    }
})

$(document).ready(function() {
    $('html,body').animate({scrollTop:0});                          //每次刷新界面滚动条置顶
    $(window).scroll(function() {                                   //滚动加载数据
        if ($(document).scrollTop() >= $(document).height() - $(window).height() && index.scrollModel) {
            index.aoData.offset += 12;
            index.$Loading.start();
            $.ajax({
                url: index.aoUrl,
                type: 'GET',
                data: index.aoData,
                success:function(res){
                    if (res.status == 200) {
                        index.$Loading.finish();
                        index.dataList = index.dataList.concat(res.data.rows);
                        if (index.dataList.length == res.data.count) {
                            index.scrollModel = false;
                        }else{
                            index.scrollModel = true;
                        }
                    }else{
                        index.$Loading.error();
                    }
                }
            })
        }
    })
});
