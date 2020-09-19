<template>

      <el-container class="home">
        <el-header><el-button type="info" size="small" @click="quitOutHandle">退出</el-button></el-header>
        <el-container class="content">
          <el-aside :width="isCollapse?'64px':'200px'" >
            <div class="ctrl-aside"  @click="ctrlAsideHandle" >|||</div>
            <el-menu router  text-color="white" :default-active="activePath" active-text-color="#409EFF" background-color="#41474b" unique-opened
                      :collapse="isCollapse" :collapse-transition="false">
              <el-submenu :index="item.id+''" v-for="item in menus" :key="item.id">
                <template slot="title">
                  <i :class="menuIcon[item.id] "></i>
                  <span>{{item.authName}}</span>
                </template>
                <el-menu-item :index="'/' + child.path" v-for="child in item.children" :key="child.id" @click="activeHandle('/' + child.path)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span> {{child.authName}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>

</template>

<script>

  export default {
        name: "Home",

      data(){
          return {
            menus: [],
            activePath: '',
            isCollapse: false,
            menuIcon: {
              "125": "iconfont icon-users",
              "103": "iconfont icon-tijikongjian",
              "101": "iconfont icon-shangpin",
              "102": "iconfont icon-danju",
              "145": "iconfont icon-baobiao",
            }

          }
      },
      beforeCreate: async function () {
        const {data: res} = await this.$http.get('menus')
        // console.log(res);
        if (res.meta.status !== 200) return
        this.menus=res.data


        this.activePath=window.sessionStorage.getItem('activePath')

        // console.log(this.activePath);

      },
      methods: {
        quitOutHandle() {
          window.sessionStorage.clear()
          this.$router.push('/login')
        },
        ctrlAsideHandle(){
          this.isCollapse=!this.isCollapse

        },
        activeHandle(ops){
          // console.log(ops);
          window.sessionStorage.setItem('activePath',ops)
        }
      }
    }
</script>

<style scoped lang="less">
  .home{
    height: 100%;

  }
.el-header{
  background-color: #373d41;
  color: #333;
  text-align: right;
  line-height: 60px;
}

  .el-aside{
    background-color: #41474b;
    height: 100%;
.ctrl-aside{
  background-color: #656f75;
  height: 30px;
  color: #fff;
  text-align: center;
  line-height: 30px;
  margin-bottom: 20px;

}
  }
  .el-menu{
    background-color: #41474b;
    color: #fff;
    border-right: none;

.iconfont{
  margin-right: 20px;
}
   .el-menu-item{
     text-align: center;
   }
  }
  .el-main{
    background-color: #eaedf1;

  }
</style>
