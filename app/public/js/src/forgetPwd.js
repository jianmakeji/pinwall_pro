var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                "margin":"",
            },
            drawerShow:false,
            email:""
        }
    },
    methods: {
        submit(){
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: '/website/users/getBackPwdWithEmail?email=' + this.email,
                type: 'GET',
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            onClose(){
                                window.location.href = "/forgetPwd";
                            }
                        })
                    } else if (res.status == 500) {
                        that.$Loading.error();
                        that.$Notice.error({
                            title:res.data
                        })
                    }
                }
            });
        }
    },
    created(){
        this.containerStyle.margin = (document.documentElement.clientHeight - 400 ) / 2 - 90 + "px auto";
    }
})
