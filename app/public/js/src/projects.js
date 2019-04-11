var projects = new Vue({
    el: '.projects',
    delimiters: ['${', '}'],
    data() {
        return {
            deleteModal:false,
            artifactId: "",
            aoData: {
                limit: 10,
                offset: 0,
                artifactId: 0
            },
            scrollModel: true,
            dataList: [],
            success: "1",
            projectStyle: {
                width: "100%",
                minHeight: ""
            },
            artifactCommentData:{
                content:"",
                commenterId:"",
                artifactId:""
            },
            artifactLikeData:{
                artifactId:"",
                artifactUserId:""
            },
            artifactScoreData: {
                artifactId: "",
                score: ""
            },
            artifactZanTag:0
        }
    },
    methods: {
        editArtifact(jobTag) {
            window.location.href = "/editUploadWork?id=" + this.aoData.artifactId + "&jobTag=" + jobTag;
        },
        deleteArtifact(){
            this.deleteModal = true;
        },
        ok() {
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: '/website/artifacts/'+this.artifactId,
                type: 'DELETE',
                data: {id: this.artifactId},
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            duration:1,
                            onClose(){
                                window.close();
                            }
                        })
                    }else{
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                    }
                }
            });
        },
        showArtifact() {
            console.log("点击隐藏、显示");
        },
        downAttach(url) {
            window.open(url);
        },
        closeThePage() {
            window.close();
        },
        zan(artifactUserId,userRole) {
            let that = this;
            this.$Loading.start();
            if (userRole == "") {
                this.$Notice.error({
                    title: "请先登录再点赞！",
                    duration: 1,
                    onClose() {
                        window.location.href = "/login";
                    }
                })
            } else {
                this.artifactLikeData.artifactUserId = artifactUserId;
                $.ajax({
                    url: '/website/artifactMedalLike',
                    type: 'POST',
                    data: this.artifactLikeData,
                    success(res){
                        if(res.status == 200){
                            that.$Loading.finish();
                            that.$Notice.success({title:res.data});
                            that.artifactZanTag = !that.artifactZanTag;
                            location.reload();
                        }else{
                            that.$Loading.error();
                            that.$Notice.error({title:res.data});
                        }
                    }
                });

            }
        },
        deleteComment(id) {
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: '/website/artifactComment/'+id,
                type: 'DELETE',
                data: {id: id},
                success(res){
                    if (res.status == 200) {
                        that.$Notice.success({
                            title:res.data,
                            duration:1,
                            onClose(){
                                $.ajax({
                                    url: '/website/artifactComment/findByArtifactIdWithPage',
                                    type: 'GET',
                                    data: that.aoData,
                                    success: function(res) {
                                        if (res.status == 200) {
                                            that.$Loading.finish();
                                            that.dataList = res.data.rows;
                                            if (that.dataList.length == res.data.count) {
                                                that.scrollModel = false;
                                            }else{
                                                that.scrollModel = true;
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }else {
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                    }
                }
            });

        },
        addComment(id) {
            let that = this;
            this.artifactCommentData.commenterId = id;
            if(this.artifactCommentData.content){
                this.$Loading.start();
                $.ajax({
                    url: '/website/artifactComment',
                    type: 'POST',
                    data: this.artifactCommentData,
                    success(res){
                        if(res.status == 200){
                            that.$Loading.finish();
                            that.$Notice.success({title:"评论成功！"});
                            that.artifactCommentData.content = "";
                            getConmentData(that, that.aoData);
                        }else{
                            that.$Loading.error();
                            that.$Notice.error({title:res.data});
                        }
                    }
                });
            }else{
                that.$Notice.error({title:"评论内容不能为空"});
            }
        },
        scoreChange(event, scoreId) {
            let regex = /^100$|^(\d|[1-9]\d)$/;
            let value = event.target.value;
            this.artifactScoreData.artifactId = scoreId;
            if (value == "") {
                this.artifactScoreData.score = 0;
            } else if (value.match(regex)) {
                this.artifactScoreData.score = value;
            } else {
                this.$Notice.error({
                    title: "请输入正确格式的分数！"
                })
            }
        },
        submitScore() {
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: '/website/artifactScores',
                type: 'POST',
                data: this.artifactScoreData,
                success(res) {
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({title:res.data});
                    }else{
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                    }
                }
            });

        }
    },
    created() {
        let that = this;
        this.projectStyle.minHeight = document.documentElement.clientHeight + "px";
        this.aoData.artifactId = window.location.href.split("project/")[1];
        this.artifactId = window.location.href.split("project/")[1];
        this.artifactCommentData.artifactId = window.location.href.split("project/")[1];
        this.artifactLikeData.artifactId = window.location.href.split("project/")[1];
        getConmentData(this, this.aoData);
        let artifactId = window.location.href.split("project/")[1];
        $.ajax({
            url: '/website/artifactMedalLike/getMedalLikeDataByUserIdAndArtifactsId',
            type: 'GET',
            data: {artifactId: artifactId},
            success(res){
                if (res.status == 200) {
                    that.artifactZanTag = 1;
                }else if(res.status == 500){
                    that.artifactZanTag = 0;
                }
            }
        });
    }
});
$(document).ready(function() {
    $('html,body').animate({
        scrollTop: 0
    }); //每次刷新界面滚动条置顶
    $(window).scroll(function() { //滚动加载数据
        if ($(document).scrollTop() >= $(document).height() - $(window).height() && projects.scrollModel) {
            projects.aoData.offset += 10;
            projects.$Loading.start();
            $.ajax({
                url: '/website/artifactComment/findByArtifactIdWithPage',
                type: 'GET',
                data: projects.aoData,
                success: function(res) {
                    if (res.status == 200) {
                        projects.$Loading.finish();
                        projects.dataList = projects.dataList.concat(res.data.rows);
                        if (projects.dataList.length == res.data.count) {
                            projects.scrollModel = false;
                        }
                    } else if (res.status == 999) {
                        that.$Notice.error({
                            title: "没有操作权限，请登录",
                            onClose() {
                                window.location.href = "/login";
                            }
                        })
                    }
                }
            })
        }
    })

    $(".attach_figure").each(function(i) {
        $(".attach_figure").mouseover(function() {
            $(this).children("button").addClass('ivu-btn-success').removeClass('ivu-btn-default');
        });
        $(".attach_figure").mouseleave(function() {
            $(this).children("button").addClass('ivu-btn-default').removeClass('ivu-btn-success');
        });
    });


});

function getConmentData(that, aoData){
    that.$Loading.start();
    $.ajax({
        url: '/website/artifactComment/findByArtifactIdWithPage',
        type: 'GET',
        data: aoData,
        success: function(res) {
            if (res.status == 200) {
                that.$Loading.finish();
                that.dataList = res.data.rows;
                if (that.dataList.length == res.data.count) {
                    that.scrollModel = false;
                }else {
                    that.scrollModel = true;
                }
            } else if (res.status == 999) {
                that.$Loading.error();
                that.$Notice.error({
                    title: "没有操作权限，请登录",
                    onClose() {
                        window.location.href = "/login";
                    }
                })
            }
        }
    })
}
