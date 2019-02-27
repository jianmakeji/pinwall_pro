
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
            mobileCodeText:"点击获取验证码",
            ruleValidate:{
                fullname:{required: true, message: '用户名不能为空', trigger: 'blur'},
                email:[
        	       {required: true, message: '手机号码不能为空', trigger: 'blur'},
        	       {required: true, len:11, message: '请输入正确手机号码格式', trigger: 'blur'}
            	],
                mobileCode:[
					{required: true, message: '请输入验证码', trigger: 'blur'},
					{len:6, message: '验证码为6位', trigger: 'blur'}
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
        //发送手机验证短信
    	sendAcodeStg:function(){
    		var that = this;
    		this.$Loading.start();
            console.log(this.formItem.email);
    		if(this.formItem.email.length == 11){
    			var url = config.ajaxUrls.createSmsMessage + this.formItem.email;
    			$.ajax({
                    dataType:"json",
                    type:"get",
                    url:url,
                    success:function(res){
                        console.log("==========",res);
                        if(res.success){
                    		that.$Loading.finish();
                        	that.$Notice.success({title:res.message, duration:3});
                        	clock(that);
                        }else{
                    		that.$Loading.error();
                        	that.$Notice.error({title:res.message, duration:3});
                        }
                    },
                    error:function(){
                		that.$Loading.error();
                    	that.$Notice.error({title:config.messages.networkError, duration:3});
                    }
                })
    		}else if(this.formItem.email.length == 0){
        		that.$Loading.error();
    			that.$Notice.error({title:"请输入手机号", duration:3});
    		}
    	},
        //验证手机验证码
    	checkMobileCode(event){
			// var that = this,
			// url = config.ajaxUrls.vertifyCode;
    		// $.ajax({
            //     dataType:"json",
            //     type:"GET",
            //     url:url,
            //     data:{email:this.formItem.email,code:this.formItem.mobileCode},
            //     success:function(res){
            //         if(res.success){
            //         	that.$Notice.success({title:res.message, duration:3});
            //         	// that.disabledBtn = false;
            //         }else{
            //         	that.$Notice.error({title:res.message, duration:3});
            //         }
            //     },
            //     error:function(){
            //     	that.$Notice.error({title:config.messages.networkError, duration:3});
            //     }
            // })
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
function clock(that){
	var num = 60;
	var int = setInterval(function(){
		num > 0 ? num-- : clearInterval(int);
		that.mobileCodeText = num + "秒后重试";
		that.disableBtn = true;
		if(num == 0){
			that.mobileCodeText = "点击获取验证码";
    		that.disableBtn = false;
		}
	},1000);
}
