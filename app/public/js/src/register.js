
var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                "margin":"",
            },
            drawerShow:false,
            formItem:{
                fullname:"",
                email:"",
                password:"",
                captchaText:""
            },
            captchaBol:false,
            ruleValidate:{
                fullname:{required: true, message: '用户名不能为空', trigger: 'blur'},
                email:[
        	       {required: true, message: '邮箱不能为空', trigger: 'blur'},
        	       {type:"email", message: '请输入正确邮箱格式', trigger: 'blur'}
            	],
                password:[
            	    {required: true, message: '请输入密码', trigger: 'blur'},
              	    {min:6, message: '密码至少为6位', trigger: 'blur'}
            	],
            	confirmPassword:[
            	    {required: true, message: '请输入密码', trigger: 'blur'},
              	    {min:6, message: '密码至少为6位', trigger: 'blur'}
            	]
            }
        }
    },
    computed:{
        disabledBtn(){
            if (this.formItem.fullname && this.formItem.email && this.formItem.password && this.captchaBol) {
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        tapClick(){
            let that = this;
            $.ajax({
                url: '/getCaptcha',
                type: 'GET',
                success(res){
                    document.getElementsByTagName("object")[0].innerHTML = res;
                }
            });
        },
        conPwdBlur(){
            if(this.formItem.password && this.formItem.confirmPassword != this.formItem.password){
    			this.$Notice.error({ title: '输入的密码不一致', duration:3});
                this.formItem.password = "";
                this.formItem.confirmPassword = "";
    		}
        },
        checkCaptcha(event){
            let that = this;
            if(event.target.value.length == 5){
                $.ajax({
                    url: '/checkCaptcha',
                    type: 'GET',
                    data:{captchaText:this.formItem.captchaText},
                    success(res){
                        if (res.status == 200){
                            that.$Notice.success({title:res.data});
                            that.captchaBol = true;
                        }else{
                            that.$Notice.error({title:res.data});
                            that.captchaBol = false;
                        }
                    }
                });
            }
        },
        registerSubmit(){
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: '/website/users/createUser',
                type: 'POST',
                data: this.formItem,
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:"注册成功!请前往邮箱激活",
                            duration:3,
                            onClose(){
                                window.location.href = "/login";
                            }
                        })
                    }else {
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                    }
                }
            });
        }
    },
    created(){
        this.containerStyle.margin = (document.documentElement.clientHeight - 400 ) / 2 - 90 + "px auto";
        let that = this;
        $.ajax({
            url: '/getCaptcha',
            type: 'GET',
            success(res){
                document.getElementsByTagName("object")[0].innerHTML = res;
            }
        });
    }
})
