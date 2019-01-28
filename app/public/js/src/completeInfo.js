var index = new Vue({
    el: '.index',
    delimiters: ['${', '}'],
    data() {
        return {
            formItem:{
                email:"",
                fullname:"",
                password:"",
                confirmPassword:"",
                captchaText:""
            },
            ruleValidate:{
            	email:[
        	       {required: true, message: '邮箱不能为空', trigger: 'blur'},
        	       {type:"email", message: '请输入正确邮箱格式', trigger: 'blur'}
            	],
            	fullname:{required: true, message: '用户名不能为空', trigger: 'blur'},
            	password:[
            	    {required: true, message: '请输入密码', trigger: 'blur'},
              	    {min:6, message: '密码至少为6位', trigger: 'blur'}
            	],
            	confirmPassword:[
            	    {required: true, message: '请输入密码', trigger: 'blur'},
              	    {min:6, message: '密码至少为6位', trigger: 'blur'}
            	]
            },
            newOrOld:"",
            isRegister:true,
            disableSbt:true,
            drawerShow: false,
        }
    },
    methods: {
        radioChange(value){
            if(value == "0"){				//  new
                this.isRegister = true;
                this.disableSbt = true;
                init_form(this);
    		}else if(value == "1"){			//  old
                this.isRegister = false;
                this.disableSbt = false;
                init_form(this);
    		}
        },
        tapClick(){
            let that = this;
            $.ajax({
                url: config.ajaxUrls.getCaptcha,
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
                    url: config.ajaxUrls.checkCaptcha,
                    type: 'GET',
                    data:{captchaText:this.formItem.captchaText},
                    success(res){
                        if (res.status == 200){
                            that.disableSbt = false;
                            that.$Notice.success({title:res.data});
                        }else{
                            that.$Notice.error({title:res.data});
                            that.disableSbt = true;
                        }
                    }
                });
            }
        },
        submit(){
            let that = this;
            this.$Loading.start();
            if (this.newOrOld == "0") {     //new
                let subUrl = config.ajaxUrls.createWxUser;
                $.ajax({
                    url: subUrl,
                    type: 'POST',
                    data: this.formItem,
                    success(res){
                        that.$Loading.finish();
                        if (res.status == 200) {
                            that.$Notice.success({title:res.data});
                            that.disableSbt = false;
                            init_form(that);
                        }else if(res.status == 999){
                            that.$Notice.error({
                                title:"没有操作权限，请登录",
                                onClose(){
                                    window.location.href = "/login";
                                }
                            });
                        }else{
                            that.$Notice.error({title:res.data});
                            init_form(that);
                        }
                    },
                    error(err){
                        that.$Loading.error();
                        that.$Notice.error({title:err.data});
                        init_form(that);
                    }
                });
            } else {
                let subUrl = config.ajaxUrls.bindWeixinInfoByEmail;
                $.ajax({
                    url: subUrl,
                    type: 'POST',
                    data: this.formItem,
                    success(res){
                        that.$Loading.finish();
                        if (res.status == 200) {
                            that.$Notice.success({title:res.data});
                            init_form(that);
                        }else if(res.status == 999){
                            that.$Notice.error({
                                title:"没有操作权限，请登录",
                                onClose(){
                                    window.location.href = "/login";
                                }
                            });
                        }else{
                            that.$Notice.error({title:res.data});
                            init_form(that);
                        }
                    },
                    error(err){
                        that.$Loading.error();
                        that.$Notice.error({title:err.data});
                        init_form(that);
                    }
                });
            }
        }
    },
    created() {
        let that = this;
        $.ajax({
            url: config.ajaxUrls.getCaptcha,
            type: 'GET',
            success(res){
                document.getElementsByTagName("object")[0].innerHTML = res;
            }
        });

    }
})
$(document).ready(function() {
    let tag = $('.error_tag').attr('tag');
    if(tag == 1){
        index.newOrOld = "1";
        index.radioChange(1);
    }
});
function init_form(that){
    that.formItem.email = "";
    that.formItem.fullname = "";
    that.formItem.password = "";
    that.formItem.confirmPassword = "";
    that.formItem.captchaText = "";
}
