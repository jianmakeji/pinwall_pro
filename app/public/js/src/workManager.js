var index = new Vue({
    el: '.index',
    data(){
        return{
            aoData:{limit:12,offset:0,visible:-1,jobTag:1},
            columns:[
                { title: '作品名',key: 'name', align: 'center',
                    render: (h, params) => {
                        return h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    target:'_blank'
                                },
                                attrs:{
                                    target:'_blank',
                                    href:'/project/' + this.dataList[params.index].Id
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, params.row.name);
                    }
                },
                { title: '上传者',key: 'filename', align: 'center',
                    render: (h, params) => {
                        return h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                attrs:{
                                    href:'/users/' + this.dataList[params.index].user.Id
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, this.dataList[params.index].user.fullname);
                    }
                },
                { title: '上传时间',key: 'createAt', align: 'center',
                    render:(h,params)=>{
                        return h('p',{

                        },this.dataList[params.index].createAt.split("T")[0])
                    }
                },
                { title: '评论数',key: 'commentCount', align: 'center'},
                { title: '获赞数',key: 'likeCount', align: 'center'},
                { title: '奖章数',key: 'medalCount', align: 'center'},
                { title: '操作',key: 'opt', align: 'center',
            	    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.editWork(params.index)
                                    }
                                }
                            }, '编辑'),
                            h('poptip',{
                        	    props: {
                        		    confirm: true,
                        		    transfer:true,
                        		    title: '确定删除此项？'
                                },
                                on: {
                            	    "on-ok": () => {
                                        this.deleteWork(params.index)
                                    }
                                }
                            }, [
                                h('Button',{
                            	    props: {
	                                    type: 'error',
	                                    size: 'small'
                            	    }
                                },"删除")
                            ])
                        ]);
                    }
                }
            ],
            dataList:[],
            currentPage:1,
            totalPage:"",
            drawerShow:false,
            containerStyle:{
                minHeight:"",
            },
            searchData:{keyword:"",limit:12,offset:0},
            searchValue:""
        }
    },
    methods: {
        searchWork(){
            this.currentPage = 1;
            if (this.searchValue) {
                this.searchData.offset = 0;
                this.searchData.keyword = this.searchValue;
                searchArtifactsByNameOrTermName(this, this.searchData);
            } else {
                this.aoData.offset = 0;
                initData(this, this.aoData);
            }
        },
        pageChange(page){
            this.currentPage = page;
            if (this.searchValue) {
                this.searchData.offset = (page - 1) * 12;
                searchArtifactsByNameOrTermName(this, this.searchData);
            } else {
                this.aoData.offset = (page-1) * 12;
                initData(this, this.aoData);
            }
        },
        editWork(index){
            window.location.href = "/editUploadWork?id=" + this.dataList[index].Id + "&jobTag=" + this.dataList[index].jobTag;
        },
        deleteWork(index){
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: '/website/artifacts/'+this.dataList[index].Id,
                type: 'DELETE',
                data: {id: this.dataList[index].Id},
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            duration:1,
                            onClose(){
                                if (that.searchValue) {
                                    searchArtifactsByNameOrTermName(that, that.searchData);
                                } else {
                                    initData(that, that.aoData);
                                }
                            }
                        });
                    }else{
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                    }
                }
            });
        },
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        initData(this, this.aoData);
    }
})

function initData(that, aoData){
    that.dataList = [];
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.getArtifacts,
        method:"GET",
        params:aoData
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

function searchArtifactsByNameOrTermName(that, searchData){
    that.dataList = [];
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.searchArtifactsByNameOrTermName,
        method:"GET",
        params:searchData
    }).then(function(res){
        if (res.status == 200) {
            let requestData = res.body.data.hits;
            that.$Loading.finish();
            for (let i = 0; i < requestData.length; i++) {
                that.dataList.push(requestData[i]._source);
            }
            that.totalPage = res.body.data.total;
        }else{
            that.$Loading.error();
        }
    },function(err){
        that.$Loading.error();
    })
}
