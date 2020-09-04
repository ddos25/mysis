<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary" size="small" @click="addRoleDialog">添加角色</el-button>
      </el-row>
      <el-table :data="rightsList" border style="width: 100%" >
        <el-table-column type="expand" >
          <template slot-scope="scope">
            <el-row :class=" [index===0?'top':'' ,'bdbottom']" v-for="(item,index) in scope.row.children"
                    :key="item.id">
              <el-col :span="5">
                <el-tag closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <el-row :class="[index2===0?'nobd':'','top']" v-for="(item2,index2) in item.children" :key="item2.id">
                  <el-col :span="5">
                    <el-row>
                      <el-tag type="success" closable>{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-row>
                  </el-col>
                  <el-col :span="14">
                    <el-tag type="warning" @close="removeTagHandle(scope.row,item3)" closable
                            v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>

                <!--<el-row v-for="item in scope.row.children" :key="item.id"><el-tag>{{item.authName}}</el-tag></el-row>-->
                <!--<el-col v-if="item.children.length!==0">-->
                <!--<el-row v-for="child in item.children" :key="child.id"><el-tag>{{child.authName}}</el-tag></el-row>-->
                <!--</el-col>-->
              </el-col>
            </el-row>

          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>

        <el-table-column
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoleDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRoleConfirm(scope.row)">删除</el-button>
          <el-button type="warning" icon="el-icon-star-off" size="mini" @click="allotRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>


    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="30%">
    <span>
      <el-form :model="addRoles" :rules="rolesRules" ref="addRolesRef" label-width="100px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addRoles.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addRoles.roleDesc"></el-input>
  </el-form-item>
      </el-form>
    </span>
      <span slot="footer">
    <el-button @click="resetAddRoleForm">取 消</el-button>
    <el-button type="primary" @click="addRoleHandle">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="30%">
    <span>
      <el-form :model="editRoles" :rules="rolesRules" ref="editRolesRef" label-width="100px">
  <el-form-item label="角色id" >
    <!--<span>{{// editRoles.id}}</span>-->
    <el-input  v-model="editRoles.roleId" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editRoles.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editRoles.roleDesc"></el-input>
  </el-form-item>
      </el-form>
    </span>
      <span slot="footer">
    <el-button @click="resetEditRoleForm">取 消</el-button>
    <el-button type="primary" @click="editRoleHandle">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="allotRoleDialogVisible" width="30%">
    <span>
      <el-tree :data="rightsTree" show-checkbox node-key="id" ref="rightTreeRef"
               :props="defaultProps" default-expand-all :default-checked-keys="defaultCheckedKeys">
    </el-tree>
    </span>
      <span slot="footer">
    <el-button @click="closeAllotDialog">取 消</el-button>
    <el-button type="primary" @click="allotRoleHandle">确 定</el-button>
  </span>
    </el-dialog>



  </div>

</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        rightsList: [],
        rightsTree:[],
        allotRole:[],

        addRoleDialogVisible: false,
        editRoleDialogVisible:false,
        allotRoleDialogVisible:false,
        defaultCheckedKeys:[],

        addRoles: {
          roleName: '',
          roleDesc: ''
        },
        editRoles:{
          roleId:0,
          roleName: '',
          roleDesc: ''
        },

        defaultProps:{
          children:'children',
          label:'authName'
        },


        rolesRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          roleDesc: [
            {required: false, message: '角色描述', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],

        }

      }

    },
    created() {
      this.getRolesList()
    },
    methods: {
      async getRolesList() {
        const {data: res} = await this.$http.get('roles')
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('无法获取角色列表')
        this.rightsList = res.data
      },

      //删除对应角色的对应权限
      async removeTagHandle(obj1, obj2) {
        const ConfirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',
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

        if (ConfirmRes === 'confirm') {
          const {data: res} = await this.$http.delete(`roles/${obj1.id}/rights/${obj2.id}`)
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error('删除失败');
          this.$message.success('删除成功');
          //更新tag列表
          obj1.children = res.data

        }

      },

      //显示添加表单
      addRoleDialog() {
        this.addRoleDialogVisible=true

      },

      //提交添加信息
      addRoleHandle(){
        this.$refs.addRolesRef.validate(async vali=>{
          // console.log(vali);
          if (!vali)return

          const {data: res} = await this.$http.post('roles', this.addRoles)
          // console.log(res);
          if (res.meta.status !== 201) return this.$message.error('创建失败')
          this.$message.success('角色创建成功')
          this.resetAddRoleForm()

          this.getRolesList()
        })
      },

      //重置添加角色表单
      resetAddRoleForm(){
        this.$refs.addRolesRef.resetFields()
        this.addRoleDialogVisible=false

      },

      //显示编辑表单
      async editRoleDialog(role){
        this.editRoleDialogVisible=true
        console.log(role);
        this.role=role
        const {data:res}=await this.$http.get(`roles/${role.id}`)
        // console.log(res);
        if (res.meta.status!==200)this.$message.error('未查询到此角色')

        this.editRoles=res.data
      },

      //提交编辑信息
      editRoleHandle(){
        this.$refs.editRolesRef.validate(async vali=>{
          if (!vali)return
          const {data:res}=await this.$http.put(`roles/${this.editRoles.roleId}`,this.editRoles)
          // console.log(res);
          if (res.meta.status!==200)return this.$message.error('编辑失败')
          this.$message.success('编辑成功')

          this.resetEditRoleForm()

          this.getRolesList()

        })
      },

      //重置编辑角色表单
      resetEditRoleForm(){
        this.$refs.editRolesRef.resetFields()
        this.editRoleDialogVisible=false

      },

     //删除角色
     async delRoleConfirm(role){
        const{data:res}=await this.$http.get(`roles/${role.id}`)
       // console.log(res);
        if (res.meta.status!==200)return this.$message.error('获取信息失败')

      const confirmRes=await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示',
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
       // console.log(confirmRes);
        if (confirmRes!=='confirm')return
       const {data:delres}=await this.$http.delete(`roles/${res.data.roleId}`)
       console.log(delres);
        if (delres.meta.status!==200)return this.$message.error('删除失败')
       this.$message.success('删除成功')
     },

    //分配权限
      async allotRights(role){
        this.allotRoleDialogVisible = true
        //  获取权限列表的树形结构
        const {data: res} = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
        // console.log(role);
        this.allotRole = role


        this.rightsTree = res.data

        //   将数据挂载到Tree组件上
        const keys = []
        this.getLeafId(role,keys)
        this.defaultCheckedKeys=keys
        // console.log(keys);
      },

      //获取当前role的所有节点的id
      getLeafId(node,keys){
        if (!node.children){
          keys.push(node.id)
        } else {
          node.children.forEach(item=>{
            this.getLeafId(item,keys)
          })
        }
      },
      //提交权限分配表单
      async allotRoleHandle(){
      //| :roleId | 角色 ID                | 不能为空`携带在url中`                                        |
      // | rids    | 权限 ID 列表（字符串） | 以 `,` 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点） |
      //  tree自带方法getCheckedKeys、getHalfCheckedKeys

        var arr1=this.$refs.rightTreeRef.getCheckedKeys()
        var arr2=this.$refs.rightTreeRef.getHalfCheckedKeys()
        var rids=[...arr1,...arr2].join(',')
        console.log(rids);

        const {data:res}=await this.$http.post(`roles/${this.allotRole.id}/rights`,{rids})

        if (res.meta.status!==200)return this.$message.error('添加权限失败')
        this.$message.success('添加成功')
        this.getRolesList()

        this.closeAllotDialog()


        // console.log(res);

      },
      closeAllotDialog(){
        this.defaultCheckedKeys=[]
        this.allotRoleDialogVisible=false

      }




    }

  }
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
  }

  .el-table {
    margin-top: 10px;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .el-tag {
    margin: 7px;
  }

  .top {
    border-top: 1px solid #eee
  }

  .nobd {
    border-top: none;
  }
  .el-form-item{
    width: 85%;
  }
</style>
