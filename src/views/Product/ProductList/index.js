import commonInput from '@/components/commonInput.vue'
import commonTable from '@/components/commonTable.vue'
import http from '@/utils/httpUtil.js'
import { mapActions, mapGetters } from 'vuex'

export default{
    data(){
        return{
            diaTitle:'批量修改',
            dialogTableVisible:false,
            isBatch:true, 
            editData:{
                condition:1,
                costPrice:1,
                productType:'',
                costNum:'',
            },
            conditions:[
                {name:'按条件查询',value:1},
                {name:'按当前页',value:2},
                {name:'按勾选条件',value:3},
            ],
            queryData:{},
            pager:{
                page:1,
                rows:20
            },
            searchFrom:[
                {
                    label:'商品编码:',
                    type:'text',
                    value:'product_code',
                    clear:true,
                    search:'like',
                    placeholder:'请输入商品编码',
                    style:'width:250px'
                },
                {
                    type:'text',
                    value:'product_name',
                    label:'商品名称:',
                    search:'like',
                    clear:true,
                    placeholder:'请输入商品名称',
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
                    value:'product_type',
                    label:'商品类型',
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
                    value:'is_sale',
                    label:'是否上架',
                    search:'eq',
                    placeholder:'请选择',
                    selectFrom:[
                        {
                            label:'是',
                            value:1
                        },
                        {
                            label:'否',
                            value:2
                        },
                    ]
                },
                {
                    type:'date',
                    name:'create_time',
                    search:'between',
                    label:'创建时间',
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
                    prop:'product_code',
                    label:'商品编码',
                },
                {
                    prop:'product_name',
                    label:'商品名称',
                },
                {
                    prop:'product_describe',
                    label:'商品描述',
                },
                {
                    prop:'product_price',
                    label:'商品价格',
                    sort:true
                },
                {
                    prop:'stock',
                    label:'库存',
                    sort:true
                },
                {
                    prop:'create_time',
                    label:'创建时间',
                    sort:true
                },
                {
                    prop:'store_name',
                    label:'所属店铺',
                },
                {
                    prop:'is_sale',
                    label:'是否上架',
                },
            ],
            count:0,
            options:{
                selection:true,  //是否开启多选
                width:200,    //操作栏长度
                operation:[
                    {type:'primary',name:'编辑',value:'edit'},
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
        this.getIndex()
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
            http.post("/product/getList",data,(res)=>{
                this.tableData=res.productList
                this.count=res.count
            })
            
        },
        getIndex(){
            http.post('/product/index',{},res=>{
                this.indexList=res
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
        closeDia(formName){
            this.dialogTableVisible=false
            this.$refs[formName].resetFields();
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