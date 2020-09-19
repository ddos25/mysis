<template>
    <div class="newgoods">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
          <el-steps :active="activeIndex" finish-status="success" process-status="process" :align-center="true">
            <el-step title=" 基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        <el-form :model="addGoods" :rules="addGoodsRules" ref="addGoodsRef" label-width="100px" style="width: 90%"
                 label-position="top">

          <el-tabs tab-position="left"  @tab-click="tabChangeHandle" :before-leave="leaveTabs">
            <el-tab-pane label="基本信息">
                <el-form-item label="商品名称" prop="goods_name" >
                    <el-input v-model="addGoods.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="addGoods.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="addGoods.goods_weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model="addGoods.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                   <el-cascader v-model="addGoods.goods_cat" :options="goodsCateList" :props="goodsCateProps"
                      @change="cascaderHandle">
                  </el-cascader>
                </el-form-item>

            </el-tab-pane>

            <el-tab-pane label="商品参数">
                <el-form-item :label="item.attr_name"  v-for="item in manyData" :key="item.attr_id">
                  <el-checkbox-group v-model="item.attr_vals" @change="checkedHandle">
                    <el-checkbox v-for="(val,i) in item.attr_vals" :label="val" :key="i" ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品属性">
                <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name" prop="attr_vals">
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>

            </el-tab-pane>

            <el-tab-pane label="商品图片">
            <el-upload  :on-remove="removeImgHandle"  :on-preview="previewHandle"   class="upload-demo"
                        :on-success="successImgHandle" :headers="upHeader" :action="uploadURL"  list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            </el-tab-pane>

            <el-tab-pane label="商品内容">
                <el-form-item prop="goods_introduce">
                  <quill-editor ref="myQuillEditor"
                                v-model="addGoods.goods_introduce"></quill-editor>
                </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <el-row style="text-align: center">

            <el-button >取 消</el-button>

            <el-button type="primary" @click="addGoodsHandle">确 定</el-button>


        </el-row>

        <el-dialog  :visible.sync="imgPreviewVisible" width="40%">
            <img :src="imgSrc" alt="">
        </el-dialog>

      </el-card>
    </div>
</template>

<script>
  import _ from 'lodash'

    export default {
      name: "newgoods",
      data() {
        const valiCascader = (rule, value, callback) => {
          if (value.length !== 3) {
            callback(new Error('请选择三级分类'));
          } else {
            callback();
          }
        };


        return {
          addGoods: {
            goods_name:'',
            goods_price:0,
            goods_weight:0,
            goods_number:0,
            goods_cat:[],
            attrs:[],
            pics:[]
          },
          goodsCateList: [],
          activeIndex: 0,
          manyData: [],
          onlyData: [],

          upHeader:{
            Authorization:window.sessionStorage.getItem('token')
          },
          uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',


          goodsCateProps: {
            value: 'cat_id',
            label: 'cat_name',
            children: 'children',
            expandTrigger: 'hover'
          },

          addGoodsRules: {
            goods_name: [
              {required: true, message: '请输入商品名称', trigger: 'blur'},
              {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
            ],
            goods_price: [
              {required: true, message: '请输入商品价格', trigger: 'blur'},
              {max: 6, message: '999999以内数值爱', trigger: 'blur'}
            ],
            goods_weight: [
              {required: true, message: '请输入商品重量', trigger: 'blur'},
              {max: 6, message: '999999以内数值', trigger: 'blur'}
            ],
            goods_number: [
              {required: true, message: '请输入商品数量', trigger: 'blur'},
            ],
            goods_id: [
              {required: true, message: '请选择商品分类', trigger: 'blur'},
              {validator: valiCascader, trigger: 'blur'}

            ]
          },
          imgPreviewVisible:false,
          imgSrc:''
        }
      },
      created() {
        this.getGoodsCate()
      },
      methods: {

        async getGoodsCate() {
          const {data: res} = await this.$http.get('categories')
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error('获取失败')
          this.goodsCateList = res.data
        },
        //tab页点击获取index，使与步骤轴一致
        async tabChangeHandle(tab, e) {
          // console.log(tab);
          this.activeIndex = Number(tab.index) + 1
          // console.log(this.activeIndex);
          if (this.activeIndex===2){
            const {data: res} = await this.$http.get(`categories/${this.catId}/attributes`, {params: {sel: 'many'}})
            if (res.meta.status !== 200) return this.$message.error('获取失败')
            res.data.forEach(item => {
              // console.log(item);
              item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(' ') : []

            })
            this.manyData = res.data
            // console.log(res.data);
          }else if(this.activeIndex===3){
            const {data: res} = await this.$http.get(`categories/${this.catId}/attributes`, {params: {sel: 'only'}})
            if (res.meta.status !== 200) return this.$message.error('获取失败')
            this.onlyData = res.data
            // console.log(res.data);
          }

        },


        //切换tab页
        leaveTabs(activeName, oldActiveName) {

          if (oldActiveName === '0' && this.addGoods.goods_cat.length !== 3) {
            this.$message.error('选第三级商品分类')
            return false
          }

        },

        //级联选择器
        cascaderHandle(op) {
          if (op.length!==3){this.addGoods.goods_cat=[]
          }else{
            this.addGoods.goods_cat = op
          }
        },
        //多选框
        checkedHandle(){
          console.log(this.manyData,this.onlyData);
        },

        previewHandle(file){
          console.log(file);
          this.imgSrc=file.response.data.url
          this.imgPreviewVisible=true
        },
        //  选择图片上传
        removeImgHandle(obj){
         const {response:res}=obj
          console.log(res);
         const index=this.addGoods.pics.findIndex(x=>{
             return x.pics===res.data.tmp_path
         })
          this.addGoods.pics.splice(index,1)
          // console.log(index);
        },
        successImgHandle(response,file,flist){
          console.log(response);
          if (response){
           const path={'pics':response.data.tmp_path}
            this.addGoods.pics.push(path)
          }
        },

        //  提交添加信息
       addGoodsHandle(){
          // console.log(this.addGoods);
          this.$refs.addGoodsRef.validate(async vali=>{
            if (!vali)return this.$message.error('please complete')

            const cloneGoods=_.cloneDeep(this.addGoods)
            cloneGoods.goods_cat=cloneGoods.goods_cat.join(',')

            this.manyData.forEach(item=>{
              console.log(item);
              const info={
                attr_id:item.attr_id,
                attr_value:item.attr_vals.join(' ')
              }
              this.addGoods.attrs.push(info)

            })
            this.onlyData.forEach(  item=>{
              const info={
                attr_id:item.attr_id,
                attr_value:item.attr_vals
              }
              this.addGoods.attrs.push(info)
            })
            cloneGoods.attrs=this.addGoods.attrs
            // console.log(cloneGoods);
            const {data:res}=await this.$http.post('goods',cloneGoods)
            console.log(res);
            if (res.meta.status!==201)return this.$message.error('fail')
            this.$message.success('create success')
            this.$refs.addGoodsRef.resetFields()

            this.$router.push('/goods')



          })
        }
      },


      computed: {
        catId() {
          if (this.addGoods.goods_cat.length !== 3) {
            return []
          } else {
            return this.addGoods.goods_cat[this.addGoods.goods_cat.length - 1]

          }

        }
      }
    }

</script>

<style scoped lang="less">
  .el-breadcrumb{
    margin-bottom: 15px;
  }
  .el-steps{
    margin: 20px 0;

  }


.el-tag{
  margin: 10px;
}
  .el-row{
    margin-top: 50px;
  }
.upload-demo{
  width: 500px;

  ul{
    width: 50%;
  }

}
  img{
    width: 100%;
  }
  .quill-editor{
    height: 400px;
  }

</style>
