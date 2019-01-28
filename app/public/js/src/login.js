var index = new Vue({
    el: '.index',
    data() {
        return {
            containerStyle: {
                "margin": "",
            },
            single: true,
            drawerShow: false,
            wxloginModal:false,
            username: "",
            password: "",
            verification: false,
            captchaText: "",
            WXcode: false,

        }
    },
    methods: {
        tapClick() {
            let that = this;
            $.ajax({
                url: '/getCaptcha',
                type: 'GET',
                success(res) {
                    document.getElementsByTagName("object")[0].innerHTML = res;
                }
            });
        },
        localStorage() {
            if (this.single) {
                window.localStorage.setItem("username", this.username);
                window.localStorage.setItem("password", this.password);
            } else {
                window.localStorage.removeItem("username");
                window.localStorage.removeItem("password");
            }
        },
        wxlogin(){
            this.wxloginModal = true;
        }
    },
    created() {
        this.containerStyle.margin = (document.documentElement.clientHeight - 450) / 2 - 90 + "px auto";
        let that = this;
        if (document.documentElement.clientWidth > 1200) {
            this.modelWidth = "60%";
        } else if (document.documentElement.clientWidth < 1200) {
            this.modelWidth = "70%";
        } else if (document.documentElement.clientWidth < 992) {
            this.modelWidth = "80%";
        }

        if (this.single) {
            this.username = window.localStorage.getItem("username");
            this.password = window.localStorage.getItem("password");
        }

        $.ajax({
            url: '/getCaptcha',
            type: 'GET',
            success(res) {
                document.getElementsByTagName("object")[0].innerHTML = res;
            }
        });
    }
})

function check(form) {
    var usernameExp = new RegExp("^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$");
    if (!usernameExp.test(form.username.value)) {
        index.$Notice.error({
            title: "请输入正确的邮箱格式或者验证码！",
            duration: 2
        });
        form.username.focus();
        return false
    }
    if (form.password.value.length < 6) {
        index.$Notice.error({
            title: "密码位数至少6位！",
            duration: 2
        });
        form.password.focus();
        return false
    }
    if (index.verification == false) {
        index.$Notice.error({title:"验证码错误",duration:2});
        form.captchaText.focus();
        return false
    }
    return true;
}
$(document).ready(function() {
    $(".captcha_input").bind("input propertychange", function() {
        let captchaStr = $(".captcha_input").val();
        if (captchaStr.length == 5) {
            $.ajax({
                url: '/checkCaptcha',
                type: 'GET',
                data:{captchaText:index.captchaText},
                success(res){
                    if (res.status == 200){
                        index.$Notice.success({title:res.data});
                        index.verification = true;
                    }else{
                        index.$Notice.error({title:res.data});
                        index.verification = false;
                    }
                }
            });
        }
    });
});
