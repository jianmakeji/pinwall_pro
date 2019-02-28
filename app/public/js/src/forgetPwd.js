var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                "margin":"",
            },
            drawerShow:false,
            disableCodeBtn:false,
            disabledBtn:true,
            mobileCodeText:"点击获取验证码",
            mobile:"",
            smsCode:"",

            // 新密码
            showUpdataData:false,//验证通过显示密码输入框
            password:"",
            confirmPassword:""

        }
    },
    methods: {
        //发送手机验证短信
    	sendAcodeStg:function(){
    		var that = this;
    		this.$Loading.start();
            var usernameExp = /^1[3|4|5|7|8][0-9]{9}$/;
    		if(usernameExp.test(this.mobile)){
    			var url = config.ajaxUrls.createSmsMessage + this.mobile;
    			$.ajax({
                    dataType:"json",
                    type:"get",
                    url:url,
                    success:function(res){
                        if(res.status == 200){
                    		that.$Loading.finish();
                        	that.$Notice.success({title:res.data, duration:3});
                        	clock(that);
                        }else{
                    		that.$Loading.error();
                        	that.$Notice.error({title:res.data, duration:3});
                        }
                    },
                    error:function(){
                		that.$Loading.error();
                    	that.$Notice.error({title:"网络异常，请稍后重试！", duration:3});
                    }
                })
    		}else if(this.mobile.length == 0){
        		that.$Loading.error();
    			that.$Notice.error({title:"请输入手机号", duration:3});
    		}
    	},
        //验证手机验证码
    	checkMobileCode(event){
            if(event.target.value.length == 6){
                var that = this,
    			url = config.ajaxUrls.vertifySms;
        		$.ajax({
                    dataType:"json",
                    type:"GET",
                    url:url,
                    data:{mobile:this.mobile,smsCode:this.smsCode},
                    success:function(res){
                        if(res.status == 200){
                        	that.$Notice.success({title:res.data, duration:3});
                            that.showUpdataData = true;
                        }else{
                        	that.$Notice.error({title:"手机号码为空或者验证码失效!", duration:3});
                        }
                    },
                    error:function(){
                    	that.$Notice.error({title:"网络异常，请稍后重试！", duration:3});
                    }
                })
            }
    	},
        conPwdBlur(){
            if(this.password && this.confirmPassword != this.password){
    			this.$Notice.error({ title: '输入的密码不一致', duration:3});
                this.password = "";
                this.confirmPassword = "";
    		}else if(this.password && this.confirmPassword == this.password){
                this.disabledBtn = false;
            }
        },
        submit(){
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: config.ajaxUrls.updatePwdWithMobileAndSmsCode,
                type: 'PUT',
                data:{
                    mobile:this.mobile,
                    smsCode:this.smsCode,
                    newPwd:this.password
                },
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            onClose(){
                                window.location.href = "/login";
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
function clock(that){
	var num = 60;
	var int = setInterval(function(){
		num > 0 ? num-- : clearInterval(int);
		that.mobileCodeText = num + "秒后重试";
		that.disableCodeBtn = true;
		if(num == 0){
			that.mobileCodeText = "点击获取验证码";
    		that.disableCodeBtn = false;
		}
	},1000);
}
