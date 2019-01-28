var index = new Vue({
    el: '.index',
    data:function(){
        return{
            containerStyle:{
                width: "100%",
                height: "500px",
                marginTop:"",
                overflow: "hidden",
                position: "relative",
            },
            drawerShow:false,
            dataList:[]
        }
    },
    created:function(){
        this.$Loading.start();
        this.containerStyle.marginTop = (document.documentElement.clientHeight - 100 - 500 - 50 ) / 2 + "px";
        var that = this;
        isChorme(this);
        this.$http({
            url: config.ajaxUrls.getIndexData,
            method:"GET",
            params:{
                num:12
            }
        }).then(function(res){
            if (res.status == 200) {
                that.$Loading.finish();
                that.dataList = res.body;
                for(var i=0; i < that.dataList.length; i++){
                    that.dataList[i].createAt = that.dataList[i].createAt.split("T")[0];
                }
            }
        },function(err){
            that.$Loading.error();
        })
    }
})
function isChorme(that){
	if(navigator.userAgent.toLowerCase().indexOf("chrome") == -1 && navigator.userAgent.toLowerCase().indexOf("firefox") == -1){
		that.$Message.error({content:"为了有更好的使用体验，推荐使用谷歌或者火狐浏览器！",closable:true,duration:0});
	}
}
