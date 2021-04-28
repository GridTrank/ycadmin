import commonInput from '@/components/commonInput.vue'
import commonTable from '@/components/commonTable.vue'
import http from '@/utils/httpUtil.js'
import { mapActions, mapGetters } from 'vuex'

export default{
    data(){
        return{
            dialogTableVisible:false,
            diaTitle:'',
            queryData:{},
            pager:{
                page:1,
                rows:20
            },
            searchFrom:[
                {
                    label:'店铺名称:',
                    type:'text',
                    value:'store_name',
                    clear:true,
                    search:'like',
                    placeholder:'请输入店铺名称',
                    style:'width:150px'
                },
                {
                    type:'date',
                    name:'create_time',
                    search:'between',
                    label:'创建时间',
                },
                {
                    type:'select',
                    value:'role_level',
                    label:'店铺等级',
                    search:'eq',
                    placeholder:'请选择',
                    selectFrom:[
                        {value:'1',label:'超级管理员'},
                        {value:'2',label:'官网'},
                        {value:'3',label:'商家店铺'},
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
            ],
            tableData:[],
            columnData:[
                {
                    prop:'store_name',
                    label:'店铺名称',
                },
                {
                    prop:'role_level',
                    label:'等级',
                },
                {
                    prop:'post_share_key',
                    label:'分享key',
                },
                {
                    prop:'mobile',
                    label:'联系方式',
                },
                {
                    prop:'create_time',
                    label:'创建时间',
                },
               
            ],
            count:0,
            options:{
                selection:false,  //是否开启多选
                width:200,    //操作栏长度
                operation:[
                    {type:'primary',name:'编辑',value:'edit'},
                    {type:'danger',name:'删除',value:'del'}
                ]
            },
            storeList:[],
            //表单选择数据
            selectOption:[],
            storeData:{}
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
    },
    methods:{
        //搜索
        search(data){
            this.queryData= data 
            this.pager.page=1
            this.pager.rows=20
            this.getData(data)
        },
        getData(data){
            data.page=this.pager.page
            data.row=this.pager.rows
            http.post("/store/storeList",data,(res)=>{
                this.tableData=res.storeList
                this.count=res.count
            })
        },
        //单个修改
        edit(data){
            this.dialogTableVisible=true
            this.diaTitle='编辑店铺'
            this.storeData=JSON.parse(JSON.stringify(data))
        },
        closeDia(formName){
            this.dialogTableVisible=false
            this.$refs[formName].resetFields();
        },
        //选择
        select(data){
            this.selectOption=JSON.parse(JSON.stringify(data))
        },
        //删除
        del(data){
            this.$confirm('删除后数据无法恢复，请确认是否执行该操作','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                http.post('/store/delStore',{...data},(res)=>{
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                })
                this.getData({})
            })
            
        },

        // 添加
        add(){
            this.dialogTableVisible=true
            this.diaTitle='添加店铺'
        },
        submitForm(){
            let url=''
            if(this.diaTitle=='添加店铺'){
                url='/store/addStore'
            }else{
                url='/store/updateStore'
            }
            http.post(url,{...this.storeData},(res)=>{
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
            })
            this.dialogTableVisible=false
            this.getData({})
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