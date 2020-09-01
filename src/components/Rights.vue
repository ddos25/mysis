<template>
    <div class="rights">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>

        <el-table
          :data="rightsList" border stripe>
         <el-table-column type="index"
            label="#">
          </el-table-column>
          <el-table-column
            prop="authName"
            label="权限名称">
          </el-table-column>
          <el-table-column
            prop="path"
            label="路径">
          </el-table-column>
          <el-table-column
            prop="level"
            label="权限等级">
            <template slot-scope="scope">
              <!--{{scope.row.level}}-->
              <!---->
              <el-tag v-if="scope.row.level==='0'" >等级一</el-tag>
              <el-tag v-if="scope.row.level==='1'" type="success">等级二</el-tag>
              <el-tag v-if="scope.row.level==='2'" type="warning">等级三</el-tag>
            </template>

          </el-table-column>
        </el-table>

      </el-card>
    </div>
</template>

<script>
    export default {
        name: "Rights",

      data(){
          return{
            rightsList:[]

          }
      },

      created(){
this.getRightsList()
      },
      methods:{
          async getRightsList(){
            const {data:res}=await this.$http.get('/rights/list')
            // console.log(res);
            if (res.meta.status!==200)return this.$message.error('无法获取权限列表')
            this.rightsList=res.data



          }
      }
    }
</script>

<style scoped>
.el-card{
  margin-top: 15px;
}
</style>
