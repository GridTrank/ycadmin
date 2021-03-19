import config from '../../../utils/config'
import http from '@/utils/httpUtil.js'
export default{
    data(){
        return{
            domain:config.Domain,
            fileData:{
                index:'',
            },
            productList:[
                
            ],
            dataList:[
                {
                    type:'',
                    pid:'',
                    img:'',
                    fileList:[]
                },
                {
                    type:'',
                    pid:'',
                    img:'',
                    fileList:[]
                },
            ]
        }
    },
    created(){
        this.getProductList()
        this.getIndex()
    },
    methods:{
        getIndex(){
            http.post('/product/index',{},res=>{
                res.forEach((el,index)=>{
                    el.fileList=[]
                    el.fileList.push({
                        status: "uploadings",
                        percentage: 100,
                        img_src:el,
                        url:this.domain+'/uploads/'+el.img
                    })
                })
                this.dataList=res
            })
        },
        getProductList(){
            http.post('/product/getList',{store_id:2},res=>{
                if(res){
                    res.productList.forEach(item=>{
                        this.productList.push({
                            pid:item.pid,
                            product_name:item.product_name
                        })
                    })
                }
            })
        },
        save(){
            let isValue=this.dataList.some(el=>{
                return !el.pid || !el.type || !el.img
            })
            if(isValue){
                this.$message({
                    type: 'warning',
                    message: '完善数据!'
                })
                return
            }
            let arr=[]
            this.dataList.forEach(el=>{
                delete el.fileList
                arr.push(Object.values(el))
            })
            http.post('/product/addIndex',{data:this.dataList},res=>{
                this.$message({
                    type: 'success',
                    message: '保存成功!'
                })
            })
        },
        fileSuccess(index,file, fileList){
            this.dataList[index].img=file.img_src
        },
        fileRemove(index, file){
            this.dataList[index].fileList=[]
        },
        add(){
            this.dataList.push(
                {
                    type:'',
                    pid:'',
                    img:'',
                    fileList:[]
                }
            )
        },
        del(val){
            let id=this.dataList[val].hid
            if(!id){
                this.dataList.splice(val,1)
                return
            }
            this.$confirm('确认删除？','删除',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                http.post('/product/delIndex',{pid:id},res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                    this.getIndex()
                })
                
            }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });          
            });
        }
    }
}