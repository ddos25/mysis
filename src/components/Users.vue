<template>
    <div class="users">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="content">
        <el-row :gutter="20">
          <el-col :span="6"><el-input placeholder="请输入内容" size="small" clearable v-model="queryInfo.query" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button></el-input></el-col>
          <el-col :span="4"> <el-button type="primary" size="small" @click="dialogHandle">添加用户</el-button></el-col>
        </el-row>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            width="50">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="180">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
              @change="changeStateHandle(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
            <el-button type="primary"  icon="el-icon-edit" size="mini" @click="editHandle(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteHandle(scope.row)"></el-button>
            <el-button type="warning" icon="el-icon-star-off" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 8, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>


      <el-dialog title="添加用户" :visible.sync="dialogVisible"
        width="30%" >
        <el-form ref="newUserRef" label-width="80px" :model="newUser" :rules="addUserRules">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="newUser.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="newUser.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="newUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="newUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="clearForm">取 消</el-button>
    <el-button type="primary" @click="addUserHandle">确 定</el-button>
  </span>
      </el-dialog>


      <el-dialog title="修改用户" :visible.sync="editDialogVisible"
        width="30%" >
        <el-form ref="editUserRef" label-width="80px" :model="editUser" :rules="editUserRules">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="editUser.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="clearEditForm">取 消</el-button>
    <el-button type="primary" @click="editUserHandle">确 定</el-button>
  </span>
      </el-dialog>

      <el-dialog title="提示" :visible.sync="deleteDialogVisible"
        width="30%" >
        <span>是否确定删除该用户？</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="delUserHandle">确 定</el-button>
  </span>
      </el-dialog>


  
    </div>
</template>

<script>
    export default {
        name: "Users",
      data(){
        let checkMobile=(rule,value,cb)=>{
          let reg=/`1[3-9]\d{9}$/
          if (reg.test(value)){return cb()}
          cb(new Error('请输入合法手机号'))

        }
        let checkEmail=(rule,value,cb)=>{
          let reg=/`([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[[a-zA-Z0-9_-])+/
         if ( reg.test(value)) {return cb()}
          cb(new Error('请输入合法的邮箱'))
        }
          return{
            queryInfo:{
              query:'',
              pagenum: 1,
              pagesize: 2
            },

            searchInfo:'',
            newUser:{
              username:'',
              password:'',
              email:'',
              mobile:''
            },
            editUser:{
              username:'',
              email:'',
              mobile:''
            },
            delUser:{},

            dialogVisible:false,
            editDialogVisible:false,
            deleteDialogVisible:false,

            addUserRules:{
              username: [
                {required: true, message: '请输入用户名', trigger: 'blur'},
                {min: 3, max: 8, message: '3 到 8个字符', trigger: 'blur'}],
              password:[
                { required: true, message: '请输入用户密码', trigger: 'blur' },
                { min: 4,  message: '长度大于 4 字符', trigger: 'blur' }
              ],
              email:[
                {required: true, message: '请输入用户名', trigger: 'blur'},
                {validator:checkEmail,   trigger: 'blur' }
              ],
              mobile:[
                { required: true,message: '请输入手机号', trigger: 'blur' },
                {validator:checkMobile,   trigger: 'blur' }
              ]

            },

            editUserRules:{
              username: [
                {required: true, message: '请输入用户名', trigger: 'blur'},
                {min: 3, max: 8, message: '3 到 8个字符', trigger: 'blur'}],
              email:[
                {required: true,message: '请输入邮箱', trigger: 'blur' },
                {validator:checkEmail,   trigger: 'blur' }
              ],
              mobile:[
                {required: true,message: '请输入手机号', trigger: 'blur' },
                {validator:checkMobile,   trigger: 'blur' }
              ]


            },



            tableData:[],
            userState:true,

            total:0,




          }
      },
      created(){
          this.getUserList()

      },
      methods:{

       async getUserList(){
       const {data:res}=await this.$http.get('users',{params:this.queryInfo})
        // console.log(res);
        this.tableData=res.data.users

         // let size=window.sessionStorage.getItem('pagesize')
         // let  num=window.sessionStorage.getItem('pagenum')
         // if (size) this.queryInfo.pagesize=size
         // if (num) this.queryInfo.pagenum=num

         this.total=res.data.total
      },
        //切换每页显示
        handleSizeChange(val) {
          this.queryInfo.pagesize=val
          this.queryInfo.pagenum=1
          // window.sessionStorage.setItem('pagesize',this.queryInfo.pagesize)

          this.getUserList()
        },
        //切换当前页
        handleCurrentChange(val) {
         this.queryInfo.pagenum=val
          // window.sessionStorage.setItem('pagenum',this.queryInfo.pagenum)

          this.getUserList()
        },
        //切换用户状态
        async changeStateHandle(user){

          const {data:res}=await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
         if (res.meta.status!==200)return this.$message({
           message: '修改失败',
           type: 'error',
           duration:1000
         });
          this.$message({
            message: '修改成功',
            type: 'success',
            duration:1000
          });
        },


        //添加对话框
        dialogHandle(){
         this.dialogVisible=true
         },

        //修改对话框
        async editHandle(info){

         this.editUser=info
          const {data:res}=await this.$http.get(`users/${info.id}`)
          // console.log(res);
         if (res.meta.status!==200)return this.$message.error('获取用户失败')
         this.editUser=res.data
          this.editDialogVisible=true
        },

        //删除对话框
        deleteHandle(info){
         this.delUser=info
          this.deleteDialogVisible=true
        },






        //确定添加用户
        addUserHandle(){
          // console.log(this.newUser);
         this.$refs.newUserRef.validate(async vali=>{
           if (!vali) return
           // console.log(vali);

           const {data:res}=await this.$http.post('users', this.newUser)
           if (res.meta.status!==201) return
           this.$message({
             message: '添加失败',
             type: 'error',
             duration:1000
           })
           console.log(res);

           this.$message({
             message: '添加成功',
             type: 'success',
             duration:1000
           })

           this.clearForm()
           this.getUserList()

         })
        },



      //  清空添加表单
        clearForm(){
          // console.log(this.$refs.newUserRef);
          this.$refs.newUserRef.resetFields()
          this.dialogVisible=false
        },


      //确定修改用户
       editUserHandle(){
         this.$refs.editUserRef.validate(async vali=>{
           if (!vali)return

         const{data:res}=await this.$http.put(`users/${this.editUser.id}`)
         console.log(res);
         if (res.meta.status!==200)return this.$message.error('修改失败')
         this.$message.success('更新成功')

         this.clearEditForm()
           this.getUserList()

         })
       },

        //  清空编辑表单
        clearEditForm(){
          this.$refs.editUserRef.resetFields()
          this.editDialogVisible=false

        },

      //确定删除用户
        async delUserHandle(){
          const {data:res}=await this.$http.delete(`users/${this.delUser.id}`)
          // console.log(res);
          if (res.meta.status!==200)return this.$message.error('删除失败' )
          this.$message.success('删除成功！')
          this.deleteDialogVisible=false

          this.getUserList()

        },




      }
    }
  
</script>

<style scoped>
  .content{
    margin-top: 10px;
    /*background-color: #fff;*/
    height: 100%  ;
  }
  .el-table{
    margin: 15px 0;
  }
  .el-form{
    width: 90%;
  }

</style>
