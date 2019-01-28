var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:""
            },
            formItem:{
                newpwd:"",
                email:"",
                activeCode:""
            },
            ruleValidate:{
                newpwd:[
            	    {required: true, message: '请输入密码', trigger: 'blur'},
              	    {min:6, message: '密码至少为6位', trigger: 'blur'}
            	]
            },
            checkPwd:"",
            drawerShow:false,
            disabledBtn:true
        }
    },
    methods: {
        checkPassword(value){
            if (value.target.value == this.formItem.newpwd) {
                this.disabledBtn = false;
            } else {
                this.disabledBtn = true;
            }
        },
        submit(){
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: config.ajaxUrls.updatePwdWithEmailAndActiveCode,
                type: 'PUT',
                data: this.formItem,
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            duration:2,
                            onClose(){
                                window.location.href = "/login";
                            }
                        })
                    }else{
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
        this.formItem.email = window.location.href.split("email=")[1].split("&")[0];
        this.formItem.activeCode = window.location.href.split("activeCode=")[1];
    }
})
