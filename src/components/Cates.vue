<template>
    <div class="cates">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row><el-button type="primary" @click="addCateDialog">添加分类</el-button></el-row>
        <zk-table ref="cateListRef" :show-index="true" index-text="#" :data="cateList" stripe border :columns="columns"
                      :selection-type="false" :expand-type="false">


          <template slot="isok" scope="scope">
            <i class="el-icon-success" style="color:#20B2AA" v-if="scope.row.cat_deleted===false"></i>
            <i class="el-icon-error" style="color:#F92672" v-else></i>
          </template>

          <template slot="cat-level" scope="scope">
            <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>

          <template slot="btns" scope="scope">
            <el-button type="primary"  icon="el-icon-edit" size="mini" @click="editCateDialog(scope.row.cat_id)"></el-button>
            <el-button type="warning" icon="el-icon-delete" size="mini" @click="delConfirmHandle(scope.row.cat_id)"></el-button>
          </template>
        </zk-table>

        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="query.pagenum"
          :page-sizes="[5, 8, 10, 20]"
          :page-size="query.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

      </el-card>

      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="30%">
        <el-form :model="addCate" :rules="addCateRules" ref="addCateRef" label-width="100px" >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCate.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader v-model="selectedCate" :options="cascaderList" :props="cascaderProp"
             @change="cascaderHandle" clearable >
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddCateDialog">取 消</el-button>
          <el-button type="primary" @click="addCateHandle">确 定</el-button>
       </span>
      </el-dialog>

      <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="30%">
        <el-form :model="editCate" :rules="addCateRules" ref="editCateRef" label-width="100px" >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="editCate.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeEditCateDialog">取 消</el-button>
          <el-button type="primary" @click="editCateHandle">确 定</el-button>
       </span>
      </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Cates",
      data(){
          return{
            query: {
              type: 3,
              pagenum: 1,
              pagesize: 5
            },
            total: 0,
            cateList: [],
            columns: [
              {
                label: '分类名称',
                prop: 'cat_name',
              },
              {
                label: '是否有效',
                prop: 'cat_deleted',
                template: 'isok',
                type: 'template',
              },
              {
                label: '排序',
                template: 'cat-level',
                type:'template',
                },
              { label: '操作',
                type:'template',
                template: 'btns',
               },
            ],
            addCateDialogVisible:false,
            editCateDialogVisible:false,

            addCate:{
              cat_name:'',
              cat_pid:0,
              cat_level:0
            },
            selectedCate:{},
            cascaderList:[],
            cascaderProp:{
              value:'cat_id',
              label:'cat_name',
              children:'children',
              multiple:false,
              expandTrigger:'hover',
              checkStrictly:'false'
            },
            editCate:{},



            addCateRules:{
              cat_name:[
                { required: true, message: '请输入分类名称', trigger: 'blur' },
                { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
              ]
            }


          }
      },
      created() {
        this.getGateList()
      },
      methods: {
        //  请求3级数据
        async getGateList() {
          const {data: res} = await this.$http.get('categories', {params: this.query})

          if (res.meta.status!==200)return this.$message.error('获取失败')
          // this.$message.success('获取成功')
          this.total=res.data.total
          this.cateList=res.data.result
          // console.log(this.cateList);
        },
        //每页显示
        sizeChangeHandle(val){
          // console.log(val);
          this.query.pagesize=val
          this.getGateList()
        },
        // 跳转第$页
        currentChangeHandle(val){
          this.query.pagenum=val
          this.getGateList()
        },

        //显示添加表单，挂载级联选择器的数据
       async addCateDialog(){
          this.addCateDialogVisible=true
          const{data:res}=await this.$http.get('categories', {params:{type:2}})
         // console.log(res);
          if (res.meta.status!==200)return this.$message.error('获取父级分类失败')
         this.cascaderList=res.data

       },
         //确定添加分类
         addCateHandle() {
          this.$refs.addCateRef.validate(async vali=>{
            if (!vali)return this.$message.error('请输入信息')

            const {data: res} = await this.$http.post('categories', this.addCate)
            // console.log(res);
            if (res.meta.status !== 201) return this.$message.error('创建失败')
            this.$message.success('创建成功')
            this.getGateList()

            this.closeAddCateDialog()
          })
        },
        //级联选择器选择
        cascaderHandle(){
          if (this.selectedCate.length===0){
            this.addCate.cat_pid=0
            this.addCate.cat_level=0
          } else{
            this.addCate.cat_pid=this.selectedCate[this.selectedCate.length-1]
            this.addCate.cat_level=this.selectedCate.length
          }
          // console.log(this.addCate);
        },
        //清空数据关闭对话框
        closeAddCateDialog() {
          this.$refs.addCateRef.resetFields()
          this.addCate={ cat_pid:0, cat_level:0}
          this.selectedCate={}
          this.addCateDialogVisible=false
        },

      //  显示编辑分类表单
        async editCateDialog(id){
          this.editCateDialogVisible=true
          const{data:res}=await this.$http.get(`categories/${id}`)
          // console.log(res);
          if (res.meta.status!==200)return this.$message.error('获取失败')
        this.editCate=res.data
        },

      //  确定编辑分类
        editCateHandle(){
          this.$refs.editCateRef.validate(async vali=>{
            if (!vali)return this.$message.error('请输入信息')
            const{data:res}=await this.$http.put(`categories/${this.editCate.cat_id}`,{cat_name:this.editCate.cat_name})
            // console.log(res);
            if (res.meta.status!==200)return this.$message.error('修改失败')
            this.$message.success('修改成功')

            this.getGateList()
            this.closeEditCateDialog()

          })

        },
        //  关闭编辑分类表单
        closeEditCateDialog(){
          this.$refs.editCateRef.resetFields()
          this.editCate={}

          this.editCateDialogVisible=false


        },
        //  删除分类
        async delConfirmHandle(id) {
          const resu = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => {
            this.$message.error(' 取消删除')
            return err
          })
          if (resu !== 'confirm') return
          const {data: res} = await this.$http.delete(`categories/${id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message.success('删除成功')

          this.getGateList()
          // console.log(res);
        }

      }
    }
</script>

<style scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
.el-row{
  margin-bottom: 10px;
}
  .el-pagination{
    margin-top: 10px;
  }
</style>
