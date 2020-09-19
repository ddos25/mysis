<template>
    <div class="goods">


      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="params.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="addGoodsDialog">添加商品</el-button>
          </el-col>
        </el-row>
        <el-table :data="goodsList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#" >
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="800" >
          </el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)"   width="120">
          </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量"  width="120" >
          </el-table-column>
          <el-table-column  label="创建时间" >
            <template slot-scope="scope">
              {{scope.row.add_time|createDate}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary"  icon="el-icon-edit" size="mini" @click="editGoodsDialog(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoodsHandle(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>


        <el-pagination @size-change="pagesizeHandle" @current-change="pagenumHandle"
          :current-page="params.pagenum" :page-sizes="[5, 10, 20,30]" :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

      </el-card>




    <el-dialog title="编辑商品" :visible.sync="editGoodsDialogVisble" width="30%">
        <el-form :model="editGoods" :rules="addGoodsRules" ref="editGoodsRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editGoods.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editGoods.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editGoods.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editGoods.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品介绍" prop="goods_introduce">
            <el-input v-model="editGoods.goods_introduce"></el-input>
          </el-form-item>
        </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="editGoodsHandle">确 定</el-button>
          </span>
        </el-dialog>

    </div>

</template>

<script>
    export default {
        name: "Goods",
      data(){
          return{
            params:{
              query:'',
              pagenum:1,
              pagesize:5
            },
            total:0,

            goodsList:[],

            // addGoods:{},
            editGoods:{},
            addGoodsDialogVisble:false,
            editGoodsDialogVisble:false,
            // activeIndex:0,


            addGoodsRules:{
              goods_name:[
                { required: true, message: '请输入商品名称', trigger: 'blur' },
                { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
              ],
              goods_price:[
                { required: true, message: '请输入商品价格', trigger: 'blur' },
              ],
              goods_weight:[
                { required: true, message: '请输入商品重量', trigger: 'blur' },
              ],
              goods_number:[
                { required: true, message: '请输入商品数量', trigger: 'blur' },
              ],
            },




          }
      },

      created() {
        this.getGoodsList()

      },

      methods: {
        async getGoodsList() {
          const {data: res} = await this.$http.get('goods', {params: this.params})
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error('err')
          this.total = res.data.total
          this.goodsList = res.data.goods


        },
        //搜索商品
        // searchHandle(){
        //   this.getGoodsList()
        //
        // },



        //跳转到添加商品页面
        addGoodsDialog() {
          // console.log(this.$router);
          this.$router.push('goods/newgoods')
        },


      //  切换每页显示
        pagesizeHandle(size){
          this.params.pagesize=size
          this.getGoodsList()
        },
      //  切换页码
        pagenumHandle(num){
          this.params.pagenum=num
          this.getGoodsList()
        },

      //  显示编辑对象信息
        async editGoodsDialog(row) {
          const {data: res} = await this.$http.get(`goods/${row.goods_id}`)
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error('err')
          this.editGoods = res.data
          this.editGoodsDialogVisble = true
        },

      //  提交编辑信息
        editGoodsHandle(){
          this.$refs.editGoodsRef.validate(async vali=>{
            if (!vali)return this.$message.error('please input')
            const{data:res}=await this.$http.put(`goods/${this.editGoods.goods_id}`,this.editGoods)
            console.log(res);
            if (res.meta.status!==200)return this.$message.error('edit err')
            this.$message.success('get')

            this.closeDialog()
          })
        },

        closeDialog(){
          this.$refs.editGoodsRef.resetFields()
          this.editGoodsDialogVisble=false
        },

        //  删除编辑对象信息
      async  delGoodsHandle(row){
         const conf=await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch((err) => {
            return err
            });
        console.log(conf);
        if (conf==='cancel'){
          this.$message('已取消')
        }else if (conf==='confirm') {
          const {data:res}=await this.$http.delete(`goods/${row.goods_id}`)
          console.log(res);
          if (res.meta.status!==200) return this.$message.error('fail')
          this.$message.success('删除成功')

          this.getGoodsList()
        }
      },

      //



      }
    }
</script>

<style scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
  .el-table{
    margin: 15px 0;
  }
  .el-steps{
    margin:0 10px
  }
  .el-tabs{
    margin-top: 50px;
  }
</style>
