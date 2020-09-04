<template>
    <div class="params">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>参数管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-alert title="注意：只允许为第三级商品分类设置相关参数" type="warning" show-icon></el-alert>

        <el-row>
          <span>请选择商品分类：</span>
          <el-cascader v-model="cateSelected" :options="cateList" :props="cateProp"
                       @change="cascaderHandle" clearable></el-cascader>
        </el-row>

          <el-menu  :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="navChangeHandle">
            <el-menu-item index="many">动态参数</el-menu-item>
            <el-menu-item index="only">静态参数</el-menu-item>
          </el-menu>
        <el-container>

          <div v-if="activeIndex==='many'" style="width: 100%">
            <el-row>
              <el-button class="addbtn" type="primary" @click="addParamsVisible = true">添加参数</el-button>
            </el-row>
            <el-table :data="manyData" border stripe style="width: 100%">
              <el-table-column type="expand"  >
                <template slot-scope="scope" >
                  <el-tag :key="index" v-for="(item,index) in scope.row.attr_vals" closable
                    :disable-transitions="false" @close="delAttrHandle(scope.row,index)">{{item}}
                  </el-tag>
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                    ref="saveTagInput" size="small" style="width: 100px"
                    @keyup.enter.native="inputHandle" @blur="inputHandle(scope.row)">
                  </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                </template>
              </el-table-column>
              <el-table-column type="index" label="#" >
              </el-table-column>
              <el-table-column prop="attr_name" label="参数名称"  >
              </el-table-column>
              <el-table-column  label="操作"  >
                <template slot-scope="scope">
                  <el-button icon="el-icon-edit" type="primary" size="mini" @click="editParamsDialog(scope.row)">修改</el-button>
                  <el-button icon="el-icon-delete" type="warming" size="mini" @click="delParamsHandle(scope.row)">删除</el-button>
                </template>
              </el-table-column>

            </el-table>

          </div>

          <div v-else style="width: 100%">
            <el-row>
              <el-button class="addbtn" type="primary">添加参数</el-button>
            </el-row>
            <el-table :data="onlyData" border stripe style="width: 100%">
              <el-table-column type="expand"  >
                <template slot-scope="scope" >
                  <el-tag :key="index" v-for="(item,index) in scope.row.attr_vals" closable
                          :disable-transitions="false" @close="delAttrHandle(scope.row,index)">{{item}}
                  </el-tag>
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                            ref="saveTagInput" size="small" style="width: 100px"
                            @keyup.enter.native="inputHandle" @blur="inputHandle(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                </template>
              </el-table-column>
              <el-table-column type="index" label="#" >
              </el-table-column>
              <el-table-column prop="attr_name" label="参数名称"  >
              </el-table-column>
              <el-table-column  label="操作"  >
                <template slot-scope="scope">
                  <el-button icon="el-icon-edit" type="primary" size="mini" @click="editParamsDialog(scope.row)">修改</el-button>
                  <el-button icon="el-icon-delete" type="warming" size="mini" @click="delParamsHandle(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

        </el-container>

      </el-card>

        <el-dialog title="添加参数" :visible.sync="addParamsVisible" width="30%">
          <el-form :model="addParams" :rules="addParamsRules" ref="addParamsRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="活动名称" prop="attr_name">
              <el-input v-model="addParams.attr_name" style="width: 85%"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeAddParamsHandle">取 消</el-button>
            <el-button type="primary" @click="addParamsHandle">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="编辑参数" :visible.sync="editParamsVisible" width="30%">
          <el-form :model="editParams" :rules="addParamsRules" ref="editParamsRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="活动名称" prop="attr_name">
              <el-input v-model="editParams.attr_name" style="width: 85%"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeEditParamsHandle">取 消</el-button>
            <el-button type="primary" @click="editParamsHandle">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="添加参数" :visible.sync="addParamsVisible" width="30%">
          <el-form :model="addParams" :rules="addParamsRules" ref="addParamsRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="活动名称" prop="attr_name">
              <el-input v-model="addParams.attr_name" style="width: 85%"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeAddParamsHandle">取 消</el-button>
            <el-button type="primary" @click="addParamsHandle">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="编辑参数" :visible.sync="editParamsVisible" width="30%">
          <el-form :model="editParams" :rules="addParamsRules" ref="editParamsRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="活动名称" prop="attr_name">
              <el-input v-model="editParams.attr_name" style="width: 85%"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeEditParamsHandle">取 消</el-button>
            <el-button type="primary" @click="editParamsHandle">确 定</el-button>
          </span>
        </el-dialog>



    </div>

</template>

<script>
    export default {
        name: "Params",
      data(){
          return{
            cateList:[],
            cateSelected:[],
            cateProp:{
              label:'cat_name',
              value:'cat_id',
              children:'children',
              expandTrigger:'hover',

            },
            activeIndex:'many',

            onlyData:[],
            manyData:[],
            toJson:{},

            inputVisible:false,
            inputValue:'',

            addParamsVisible:false,
            editParamsVisible:false,

            addParams:{},

            editParams:{},

            addParamsRules:{
              attr_name:[
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
              ]
            }



          }
      },
      created() {
        this.getCateList()
      },

      methods: {
        //  获取分类列表
        async getCateList() {
          const {data: res} = await this.$http.get('categories')
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error('获取失败')
          this.cateList = res.data
        },

        //级联选择器选择
        cascaderHandle() {
          // console.log(this.cateSelected);
          if (this.cateSelected.length===3){

            this.getAttrDataList()
          }else{
            this.cateSelected=[]
              this.onlyData=[]
              this.manyData=[]
          }
      },

        //返回级联选择器被选id
        selectedId(){
           if (this.cateSelected.length===3) {
             return this.cateSelected[this.cateSelected.length-1]
           }else{
             return null
           }
        },

        //标签切换
        navChangeHandle(index){
           this.activeIndex=index

          this.getAttrDataList()
          // console.log(index);
        },

        //获取参数列表
        async getAttrDataList() {
          const {data: res} = await this.$http.get(`categories/${this.selectedId()}/attributes`, {params: {sel: this.activeIndex}})
          if (res.meta.status !== 200) {
            return this.$message.error('获取失败')
          }

          res.data.forEach(item=>{
              item.attr_vals=item.attr_vals.length>0?item.attr_vals.split(' '):[]
            //为每个参数添加各自的input和value
            item.inputVisible = false
            item.inputValue = ''

          })


          if ( this.activeIndex==='only'){
            this.onlyData=res.data
          } else if (this.activeIndex==='many') {
            this.manyData=res.data
            //  将动态参数的字符串分为数组
          }

          // console.log(this.manyData,this.onlyData);
        },


        //  提交参数
        async inputHandle(obj) {
          if (obj.inputValue.trim().length === 0) {
            // console.log(obj);
            obj.inputValue = ''
            obj.inputVisible = false
            return
          }
          obj.attr_vals.push(obj.inputValue)
          const {data: res} = await this.$http.put(`categories/${obj.cat_id}/attributes/${obj.attr_id}`, {
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            attr_vals: obj.attr_vals.join(' ')
          })
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error('创建失败')

          this.$message.success('创建成功')
          // this.getAttrDataList()
          obj.inputValue = ''
          obj.inputVisible = false

        },

        //  显示输入框
        showInput(input) {
          input.inputVisible = true
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        },


        //  确定添加表单
        addParamsHandle() {
          this.$refs.addParamsRef.validate(async vali=>{
            if (!vali)return this.$message.error('please input')

          const {data:res}=await this.$http.post(`categories/${this.selectedId()}/attributes`,{
              attr_name: this.addParams.attr_name, attr_sel:this.activeIndex
            })
            // console.log(res);
            if (res.meta.status!==201)return  this.$message.error('create err')
            this.$message.success('create success')

            this.getAttrDataList()

            this.closeAddParamsHandle()

          })

        },

        //关闭添加表单
        closeAddParamsHandle(){
          this.addParams={}

          this.$refs.addParamsRef.resetFields()
          this.addParamsVisible=false

        },

        //编辑参数名称
        async editParamsDialog(row) {
          this.editParamsVisible = true
          console.log(row);
          const {data: res} = await this.$http.get(`categories/${this.selectedId()}/attributes/${row.attr_id}`)
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error('get info error')
          this.editParams = res.data
        },

      //  提交修改数据
        editParamsHandle(){
          this.$refs.editParamsRef.validate(async vali=>{
            if (!vali)return  this.$message.error('please input')

            const {data:res}=await this.$http.put(`categories/${this.selectedId()}/attributes/${this.editParams.attr_id}`,this.editParams)
            console.log(res);
            if (res.meta.status!==200)return  this.$message.error('update err')
            this.$message.success('update success')

            this.getAttrDataList()

            this.closeEditParamsHandle()

          })

        },

        //  关闭编辑表单
        closeEditParamsHandle() {
          this.editParams = {}

          this.$refs.editParamsRef.resetFields()

          this.editParamsVisible = false
        },
        //删除参数
        async delParamsHandle(row) {
          const resu = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch((err) => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
            return err
          })

          console.log(resu);
          if (resu === 'confirm') {
            const {data: res} = await this.$http.delete(`categories/${this.selectedId()}/attributes/${row.attr_id}`)
            console.log(res);
            if (res.meta.status !== 200) return this.$message.error('delete err')
            this.$message.success('delete success')

            this.getAttrDataList()

          }
        },

        //删除attr
        async delAttrHandle(row, index) {
          row.attr_vals.splice(index, 1)
          const {data: res} = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' ')
          })
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error('update error')

        }
      }
    }
</script>

<style scoped>
.el-breadcrumb{
  margin-bottom: 15px ;
}
.el-alert{
  margin-bottom: 10px;
}
  .el-container{
    /*height: 1100px;*/
    /*background-color: plum;*/
  }
 .addbtn{
   margin: 15px;
 }
  .el-tag{
    margin: 15px;
  }
</style>
