Vue.use(VueLazyload)
var index = new Vue({
    el: '.index',
    data(){
        return{
            aoData:{limit:12,offset:0,keyword:""},
            containerStyle:{
                minHeight:""
            },
            drawerShow:false,
            scrollModel:true,
            modelWidth:"",
            // 搜索弹出层
            searchModel:true,  /* 搜索弹出层model */
            searchModelValue:"",    /*搜索内容*/
            searchModelDataList:[],
            columns1:[
                {title:"搜索结果",key:"text"}
            ],
            dataList:[]
        }
    },
    methods: {
        searchDataChange(data){
            let value = data.target.value;
            let that = this;
            $.ajax({
                url: config.ajaxUrls.suggestKeyWords,
                type: 'GET',
                data: {keyword: value},
                success(res){
                    if (res.status == 200) {
                        that.searchModelDataList = res.data;
                    }
                }
            });
        },
        // 回车搜索
        searchModelData(){
            let that = this;
            this.searchModel = false;
            this.aoData.keyword = this.searchModelValue;
            getData(that);
        },
        toSearch(value){
            let that = this;
            this.searchModelValue = value;
            this.searchModel = false;
            this.aoData.keyword = value;
            getData(that);
        },
        // 搜索结果字段选择
        selectItem(data){
            let that = this;
            this.searchModelValue = data.text;
            this.searchModel = false;
            this.aoData.keyword = data.text;
            getData(that);
        },
    },
    created(){
        let that = this;
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "950px";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }
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
            index.aoData.offset += 12;
            index.aoData.keyword = index.searchModelValue;

            getMoreData(index);
        }
    })
});

function getData(that){
    that.$Loading.start();
    $.ajax({
        url: config.ajaxUrls.searchByKeywords,
        type: 'GET',
        data: that.aoData,
        success:function(res){
            if (res.status == 200) {
                that.$Loading.finish();
                that.dataList = res.data.hits;
                if (that.dataList.length == res.data.total) {
                    that.scrollModel = false;
                }else {
                    index.scrollModel = true;
                }
            }else{
                that.$Loading.error();
                that.$Notice.error({title:res.data});
            }
        }
    })
}
function getMoreData(index){
    index.$Loading.start();
    $.ajax({
        url: config.ajaxUrls.searchByKeywords,
        type: 'GET',
        data: index.aoData,
        success:function(res){
            index.$Loading.finish();
            index.dataList = index.dataList.concat(res.data.hits);
            if (index.dataList.length == res.data.total) {
                index.scrollModel = false;
            }else {
                index.scrollModel = true;
            }
        }
    })
}
