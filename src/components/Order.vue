<template>
    <div class="order">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row>
          <el-input placeholder="请输入内容"  class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-row>
        <el-table :data="ordersList" stripe border  style="width: 100%">
          <el-table-column  label="#" type="index" width="60">
          </el-table-column>
          <el-table-column prop="order_number" label="订单编号" >
          </el-table-column>
          <el-table-column prop="order_price" label="订单价格" >
          </el-table-column>
          <el-table-column label="是否付款">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.pay_status==='0'" type="danger">未付款</el-tag>
              <el-tag v-else type="danger">已付款</el-tag>
            </template>

          </el-table-column>
          <el-table-column prop="is_send" label="是否发货">
          </el-table-column>
          <el-table-column  label="下单时间">
            <template slot-scope="scope">
              {{scope.row.create_time|createDate}}
            </template>
          </el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button type="primary"  icon="el-icon-edit" size="mini" @click="editOrderHandle(scope.row.order_id)"></el-button>
              <el-button type="success"  icon="el-icon-location" size="mini" @click="infoDialog"></el-button>
            </template>

          </el-table-column>
        </el-table>


        <el-pagination @size-change="sizeChangeHandle" @current-change="numChangeHandle"
          :current-page="params.pagenum" :page-sizes="[5, 10, 30, 40]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-card>


      <el-dialog title="修改地址" :visible.sync="adressInfoVisible" width="30%">
        <el-form :model="addressInfo" :rules="addressRules" ref="addressInfoRef"
                 label-width="100px" label-position="top" >
          <el-form-item label="选择省/市/区" prop="addr1">
            <el-cascader v-model="addressInfo.addr1" :options="cityInfo" :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="addr2">
            <el-input v-model="addressInfo.addr2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adressInfoVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAddrHandle">确 定</el-button>
        </span>

      </el-dialog>


      <el-dialog title="物流信息" :visible.sync="kuadiInfoVisible" width="50%">
        <el-timeline >
          <el-timeline-item v-for="(item, index) in kuaidiInfo" :key="index"
            :timestamp="item.time">
            {{item.context}}
          </el-timeline-item>
        </el-timeline>

      </el-dialog>


    </div>
</template>

<script>
  import cityInfo from '../assets/citydata.js'

    export default {
        name: "Order",
      data(){
          return{
            params:{
              query:'',
              pagenum:1,
              pagesize:5,
            },
            total:0,
            ordersList:[],
            editOrderInfo:{},

            cityInfo:cityInfo,
            addressInfo:{
              addr1:[],
              addr2:''
            },
            addressRules:{
              addr1:[
                { required: true, message: '请选择', trigger: 'blur' },
              ],
              addr2:[
                { required: true, message: '请输入', trigger: 'blur' },
              ],
            },
            props:{
              value:'value',
              label:'label',
              children:'children',
              expandTrigger: 'hover',
            },

            kuaidiInfo:[],
            adressInfoVisible:false,
            kuadiInfoVisible:false,


          }
      },
      created(){
          this.getOrdersList()
      },

      methods:{
         //
         async getOrdersList(){

           const {data:res}=await this.$http.get('orders',{params:this.params})
            // console.log(res);
            if ( res.meta.status!==200) return this.$message.error('error')
           this.total=res.data.total

           this.ordersList=res.data.goods
           // console.log( this.params);
          },





        //
        sizeChangeHandle(size){
           this.params.pagesize=size
          this.getOrdersList()

        },
      //
        numChangeHandle(num){
          // console.log(num);
          this.params.pagenum=num
          this.getOrdersList()
        },

       async editOrderHandle(id){
         // console.log(kuaidiInfo);
         const {data:res}= await this.$http.get(`orders/${id}`)
         console.log(res);
           if (res.meta.status!==200) return this.$message.error('err')
         this.editOrderInfo=res.data


         this.adressInfoVisible=true
       },

       //
        editAddrHandle(){
           this.$refs.addressInfoRef.validate(vali=>{
             if(!vali)return this.$message.error('null')

           })
        },

       //
       async infoDialog(){
           const {data:res}=await this.$http.get('kuaidi/804909574412544580')
         // console.log(res);
           if (res.meta.status!==200)return this.$message.error('err')
       this.kuaidiInfo=res.data

         this.kuadiInfoVisible=true

       },

      }
    }
</script>

<style scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
  .el-pagination{
    margin: 15px 0;
  }

.el-input{
  width: 400px;
  margin-bottom: 20px;
}
  .el-table{
    min-width: 1200px;
  }
  .el-dialog{
    padding: 20px;
  }
  .el-form{
    margin: 20px;
  }
</style>
