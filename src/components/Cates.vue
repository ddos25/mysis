<template>
    <div class="cates">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>


      </el-card>

    </div>
</template>

<script>
    export default {
        name: "Cates"
    }
</script>

<style scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
</style>
