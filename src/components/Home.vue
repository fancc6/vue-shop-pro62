<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退 出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menushow ? '65px' : '200px'">
        <div
          style="background-color:rgb(74, 80, 100); height: 25px; line-height: 25px; font-size: 12px; text-align: center; color: white;letter-spacing: 0.1em; user-select: none; cursor: pointer;"
          @click="menushow=!menushow"
        >|||</div>
        <el-row>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :style="menushow ? 'width:65px;' : 'width:200px;'"
            :collapse="menushow"
            :collapse-transition="false"
            :router="true"
          >
            <el-submenu :index="item.id+''" v-for="(item, k) in menuList" :key="item.id">
              <template slot="title">
                <i :class="'iconfont icon-'+menuicon[k]"></i>
                <span>{{ item.authName }}</span>
              </template>

              <el-menu-item-group>
                <el-menu-item
                :index="item2.path"
                v-for="item2 in item.children"
                :key="item2.id"
                >
                    <i class="el-icon-menu"></i>
                    <span>{{item2.authName}}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-row>
      </el-aside>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getMenuList()
  },
  data() {
    return {
      // 左侧按钮导航是否显示
      menushow: false,
      // 接收的后端返回的左侧显示的权限信息
      menuList: [],
      menuicon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  },
  methods: {
    // 获得用于显示的左侧导航权限信息
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      // 获取失败处理
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res)
      // 把权限数据赋予给menuList
      this.menuList = res.data
    },
    logout() {
      // 确认退出
      // 清除token
      // 页面跳转到login
      this.$confirm('确定要退出系统么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 移除token
          window.sessionStorage.removeItem('token')
          // 重定向
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '您已成功退出系统!'
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: rgb(55, 61, 65);
    padding: 0;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    #logo-box {
      color: #ffffff;
      font-size: 22px;
      display: flex;
      align-items: center; // 垂直方向居中
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
