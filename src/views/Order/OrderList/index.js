import commonInput from '@/components/commonInput.vue'
import commonTable from '@/components/commonTable.vue'
import http from '@/utils/httpUtil.js'
import { mapActions, mapGetters } from 'vuex'

export default{
    data(){
        return{
            queryData:{},
            pager:{
                page:1,
                rows:20
            },
            searchFrom:[
                {
                    type:'date',
                    name:'create_time',
                    search:'between',
                    label:'创建时间',
                },
                {
                    label:'订单编号:',
                    type:'text',
                    value:'order_id',
                    clear:true,
                    search:'like',
                    placeholder:'请输入商品编码',
                    style:'width:250px'
                },
                {
                    type:'select',
                    value:'store_id',
                    label:'所属店铺',
                    search:'eq',
                    placeholder:'请选择',
                    selectFrom:[
                        
                    ]
                },
                {
                    type:'select',
                    value:'order_type',
                    label:'订单类型',
                    search:'eq',
                    placeholder:'请选择',
                    selectFrom:[
                        {
                            label:'官网',
                            value:2
                        },
                        {
                            label:'商家',
                            value:3
                        },
                    ]
                },
                {
                    type:'select',
                    value:'order_status',
                    label:'订单状态',
                    search:'eq',
                    placeholder:'请选择',
                    selectFrom:[
                        {
                            label:'待付款',
                            value:1
                        },
                        {
                            label:'已付款',
                            value:2
                        },
                        {
                            label:'已发货',
                            value:3
                        },
                        {
                            label:'已收货',
                            value:4
                        },
                    ]
                },
                
                {
                    type:'btn',
                    btntxt:'搜索',
                    btnType:'primary',
                    value:'search'
                },
                {
                    type:'btn',
                    btntxt:'添加',
                    btnType:'primary',
                    value:'add'
                },
                {
                    type:'btn',
                    btntxt:'重置条件',
                    btnType:'primary',
                    value:'reset'
                },
                {
                    type:'btn',
                    btntxt:'批量删除',
                    btnType:'primary',
                    value:'batchDel'
                },
         
            ],
            
            tableData:[],
            columnData:[
                {
                    prop:'order_id',
                    label:'订单编码',
                },
                {
                    prop:'order_type',
                    label:'订单类型',
                },
                {
                    prop:'order_status',
                    label:'订单状态',
                },
                {
                    prop:'total_price',
                    label:'订单总额',
                    sort:true
                },
                {
                    prop:'create_time',
                    label:'下单时间',
                    sort:true
                },
                {
                    prop:'update_time',
                    label:'操作时间',
                    sort:true
                },
                {
                    prop:'store_name',
                    label:'下单用户',
                },
                {
                    prop:'rece_address',
                    label:'收货地址',
                },
                {
                    prop:'delivery',
                    label:'物流',
                },
            ],
            count:0,
            options:{
                selection:true,  //是否开启多选
                width:200,    //操作栏长度
                operation:[
                    {type:'primary',name:'编辑',value:'redirect'},
                    {type:'danger',name:'删除',value:'del'}
                ]
            },
            storeList:[],
            //表单选择数据
            selectOption:[],
            //修改条件数据
            changeEditData:[],
            indexList:[]
        }
    },
    components:{
        commonInput,
        commonTable
    },
    computed: {
        ...mapGetters([
            'getUserInfo',
        ])
      },
    created(){
        this.getData({})
        this.getStoreList()
    },
    methods:{
        //搜索
        search(data){
            this.queryData= data 
            this.pager.page=1
            this.pager.rows=20
            this.getData(data)
        },
        getStoreList(){
            http.post('/store/storeList',{},(res)=>{
                if(res){
                    this.storeList=res.storeList
                    let arr=[]
                    res.storeList.forEach(item=>{
                        if(item.store_name){
                            arr.push({
                                label:item.store_name,
                                value:item.store_id,
                            })
                        }
                    })
                    let sid=Number(this.getUserInfo.userInfo.store_id) 
                    if(sid===1){
                        arr.forEach(i=>{
                            this.searchFrom[2].selectFrom.push(i)
                        })
                    }else{
                        this.searchFrom[2].selectFrom=arr.filter(item=>{
                            return sid==item.store_id
                        })
                        arr.forEach(i=>{
                            if(sid==i.value){
                                this.searchFrom[2].selectFrom.push(i)
                            }
                        })
                    }
                }
            })
        },
        getData(data){
            data.page=this.pager.page
            data.row=this.pager.rows
            data.store_id= data.store_id?data.store_id[1]:'' || Number(this.getUserInfo.userInfo.store_id) 
            http.post("/order/getList",data,(res)=>{
                this.tableData=res.orderList
                this.count=res.count
            })
        },
        //单个修改
        edit(data){
            this.$router.push({
                path:'/Product/Detail',
                query:{
                    type:'edit',
                    pid:data.pid
                }
            })
        },
        //批量修改
        batchModify(data){
            this.isBatch=true
            this.dialogTableVisible=true
            this.diaTitle='批量修改'
            this.changeCondition(0)
        },
        //切换修改条件
        changeCondition(val){
            let condition=this.editData.condition
            let data=JSON.parse(JSON.stringify(this.queryData)) 
            if(condition===1){
                data.page=1
                data.rows=9999
                this.getProductCost(data)
            }else if(condition===2){
                data.page=this.pager.page
                data.rows=this.pager.rows
                this.getProductCost(data)
            }else{
                if(this.selectOption.length<=0){
                    this.$message.error("请至少选择一个条件")
                    this.editData.condition=1
                    return
                }else{
                    this.changeEditData=this.selectOption
                }
            }
        },
        //获取修改数据
        getProductCost(data){
            http.post('/warn_product/index',data,(res)=>{
                this.changeEditData=res.items              
            })
        },
        //确认修改
        change(formName){
            let changeEditData=this.changeEditData
            let editData=this.editData
            if(!editData.costPrice && !editData.productType){
                this.dialogTableVisible=false
                return
            }
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    let data=[]
                    changeEditData.forEach(item=>{
                        let obj={}
                        let costPrice = 0;
                        let costNum = Number(editData.costNum);
                        switch (editData.costPrice){
                            case 0:
                                costPrice=item.costPrice
                                break;
                            case 1:
                                costPrice=costNum
                                break;
                            case 2:
                                costPrice=Number(item.originalPrice) + costNum
                                break;
                            case 3:
                                costPrice=Number(item.originalPrice) * costNum
                                break;
                            case 4:
                                costPrice=Number(item.costPrice) + costNum
                                break;
                            case 5:
                                costPrice=Number(item.costPrice) * costNum
                                break;
                        }
                        obj.costPrice=costPrice
                        obj.originalPrice=item.originalPrice
                        editData.productType?obj.productType=editData.productType:delete obj.productType
                        obj.warnProductId=item.warnProductId
                        data.push(obj)
                    })
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    http.post("/warn_product/edit",data,(res)=>{
                        loading.close()
                        if(res){
                            this.$message({
                                message:'修改成功',
                                type:'success'
                            })
                            this.dialogTableVisible=false
                            this.getData({})
                        }
                    })
                }else{
                    return false
                }
            })
        },
        closeDia(formName){
            this.dialogTableVisible=false
            this.$refs[formName].resetFields();
        },
        
        redirect(data){
            this.$router.push({
                path:'/Order/Detail',
                query:{
                    
                }
            })
        },
        //选择
        select(data){
            this.selectOption=data
        },
        //删除
        del(data,type){
            //批量删除
            if(type=='all' && this.selectOption.length<=0){
                this.$message.error("请至少选择一个条件")
                return
            }
            this.$confirm('删除后数据无法恢复，请确认是否执行该操作','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids=[]
                if(type=='all'){
                    this.selectOption.forEach(item=>{
                        ids.push(item.pid)
                    })
                }else{
                    ids[0]=data.pid
                }
                let query={
                    pid:ids
                }
                let isShow=true
                this.indexList.forEach(item=>{
                    if(ids.indexOf(item.pid)!=-1){
                        isShow=false
                    }
                })
                if(!isShow){
                    this.$message({
                        type: 'warning',
                        message: '首页展示中!'
                    });
                    return
                }
                http.post('/product/delProduct',query,(res)=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getData({})
                })
                
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
            })
        },

        // 添加
        add(){
            this.$router.push({
                path:'/Product/Detail',
                query:{
                    type:'add'
                }
            })
        },
        //导出
        exportReport(val){
            this.isVisible=true
        },
        
        //分页页码
        currentChange(val){
            this.pager.page=val
            this.getData(this.queryData)
        },
        //页数
        sizeChange(val){
            this.pager.rows=val
            this.getData(this.queryData)
        }
    }
}