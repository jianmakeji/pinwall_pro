var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:"",
            },
            aoData:{limit:12,offset:0},
            userRoleData:{userId:"",operation:""},
            groupModel:1,       //搜索筛选选项
            columns:[
                { title: '用户名',key: 'fullname', align: 'center',minWidth:200,
                    render: (h, params) => {
                        return h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                attrs:{
                                    href:'/users/' + this.dataList[params.index].Id
                                }
                            }, this.dataList[params.index].fullname);
                    }
                },
                { title: '邮箱',key: 'email', align: 'center',minWidth:200},
                { title: '上传作品数',key: 'artifactCount', align: 'center'},
                { title: '点赞数',key: 'likeCount', align: 'center'},
                { title: '发表言论',key: 'commentCount', align: 'center'},
                { title: '获得奖章',key: 'medalCount', align: 'center'},
                { title: '状态',key: 'active', align: 'center',
                    render:(h, params) => {
                        return h('p', params.row.active ? "激活" : "未激活")
                    }
                },
                { title: '权限',key: 'name', align: 'center',
                    render:(h, params) => {
                        return h('p', {
                            props:{

                            }
                        },params.row.roles[0].name)
                    }
                },
                { title: '操作',key: 'opt', align: 'center',
                    render: (h, params) => {
                        if (params.row.roles[0].name == "user") {
                            return h('Button',{
                                props: {
                                    type: 'default',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.becomeVIP(params.index)
                                    }
                                }
                            },"设为VIP")
                        } else {
                            return h('Button',{
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                   click: () => {
                                       this.becomeVIP(params.index)
                                    }
                                }
                            },"设为用户")
                        }
                    }
               }
            ],
            dataList:[],
            currentPage:1,
            totalPage:"",
            drawerShow:false,
            searchUserNameData:{fullname:"",offset:0,limit:12},
            searchEmailData:{email:"",offset:0,limit:12},
            searchValue:""
        }
    },
    methods: {
        /**
         * [groupCheck 用户搜索标签选择事件]
         */
        groupCheck(value){
            this.groupModel = value;
        },
        searchUser(){
            this.currentPage = 1;
            if (this.groupModel == 1) {
                this.searchUserNameData.offset = 0;
                this.searchUserNameData.fullname = this.searchValue;
                initDataByUsername(this, this.searchUserNameData);
            } else if(this.groupModel == 2){
                this.searchEmailData.offset = 0;
                this.searchEmailData.email = this.searchValue;
                initDataByEmail(this, this.searchEmailData);
            }
        },
        /**
         * [pageChange 分页控件切换]
         */
        pageChange(page){
            this.currentPage = page;
            if (this.groupModel == "1") {
                this.searchUserNameData.offset = (page - 1) * 12;
                initDataByUsername(this, this.searchUserNameData);
            } else if(this.groupModel == "2"){
                this.searchEmailData.offset = (page - 1) * 12;
                initDataByEmail(this, this.searchEmailData);
            }
        },
        clickUserName(id){
            window.location.href = "/users/" + id;
        },
        becomeVIP(index){
            let that = this;
            this.userRoleData.userId = this.dataList[index].Id;
            if(this.dataList[index].roles[0].name == "user"){
                this.userRoleData.operation = "vip";
            }else{
                this.userRoleData.operation = "user";
            }
            $.ajax({
                url: config.ajaxUrls.updateUserRole,
                type: 'PUT',
                data: this.userRoleData,
                success(res){
                    if (res.status == 200) {
                        that.$Notice.success({title:res.data});
                        if (that.groupModel == "1") {
                            initDataByUsername(that, that.searchUserNameData);
                        } else if(that.groupModel == "2"){
                            initDataByEmail(that, that.searchEmailData);
                        }
                    } else {
                        that.$Notice.error({title:res.data});
                    }
                }
            });
        }
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        initDataByUsername(this, this.searchUserNameData);
    }
})

function initDataByUsername(that,searchUserNameData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.searchByUsername,
        method:"GET",
        params:searchUserNameData
    }).then(function(res){
        if (res.body.status == 200) {
            that.$Loading.finish();
            that.totalPage = res.body.data.count;
            that.dataList = res.body.data.rows;
        }else{
            that.$Loading.error();
        }
    },function(err){
        that.$Loading.error();
    })
}
function initDataByEmail(that, searchEmailData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.searchByEmail,
        method:"GET",
        params:searchEmailData
    }).then(function(res){
        if (res.body.status == 200) {
            that.$Loading.finish();
            that.totalPage = res.body.data.count;
            that.dataList = res.body.data.rows;
        }else {
            that.$Loading.error();
        }
    },function(err){
        that.$Loading.error();
    })
}
