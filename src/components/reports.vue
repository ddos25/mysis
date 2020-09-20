<template>
    <div class="reports">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <div id="main"></div>

      </el-card>

    </div>
</template>

<script>
  import echarts from 'echarts'
  import _ from 'lodash'
    export default {
        name: "reports",
      data(){
        return {

          options:{
            title: {
              text: '堆叠区域图'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            xAxis: [
              {
                boundaryGap: false
              }
            ],

            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },

          }

        }

      },
      created(){

      },

      async mounted(){

          const {data:res}=await this.$http.get('reports/type/1')

          if (res.meta.status!==200) return this.$message.error('err')

          // console.log( this.reportsList);



        const   myChart = echarts.init(document.getElementById('main'));

        const op=_.merge(this.options,res.data)
        console.log(op);


        myChart.setOption(op)

      },
      methods:{
      },
    }
</script>

<style scoped>
  .el-breadcrumb{
    margin-bottom: 15px;
  }

 #main{
   width: 750px;
   height: 400px;
  }

</style>
