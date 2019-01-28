var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:"",
            },
            userId:"1",
            drawerShow:false,
            terms_value:"",
            terms_arr:[],
            formItem:{
                type:"",
                name:"",
                terms:[],
                description:"",
                status:0,
                jobTag:1,
            }
        }
    },
    methods: {
        createTerm(){
            let XO = true;
            for(let i=0;i<this.terms_arr.length;i++){
                if (this.terms_arr[i].name == this.terms_value) {
                    XO = false;
                    this.$Notice.error({title:"该标签已添加!"});
                }
            }
            if(this.terms_value && XO){
                let subterm = new Object();
                subterm.name = this.terms_value;
                this.terms_arr.push(subterm);
                this.terms_value = "";
            }
        },
        deleteTerm(index){
            this.terms_arr.splice(index,1);
        },
        submitData(){
            let that = this;
            this.$Loading.start();
            this.formItem.terms = this.terms_arr;
            $.ajax({
                url: config.ajaxUrls.getTopicsData,
                type: 'POST',
                data: this.formItem,
                success:function(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:"作业荚创建成功，2秒后返回",
                            duration:2,
                            onClose:function(){
                                if (that.formItem.jobTag == 1) {
                                    window.location.href = "/topics";
                                } else {
                                    window.location.href = "/topicsAbout";
                                }
                            }
                        })
                    }else{
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                    }
                }
            })
        }
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        let topicJobtog = window.location.href.split("?jobTag=")[1];
        if (topicJobtog == 2) {
            this.formItem.jobTag = 2;
        }
    }
})
