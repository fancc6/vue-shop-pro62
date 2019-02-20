<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索框和添加用户按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdt.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格展示数据列表 -->
      <el-table :data="userInfos" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="110"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <!-- 插槽填充
                在此位置要获取"每个"用户的信息, 具体是用户的状态信息
                用户的信息已经被子组件(el-table-column)的插槽传递过来了
                <slot row = "每个用户的数据对象"></slot>
                因此可以通过如下方式获得当前遍历好的每个用户信息
                <span slot-scope="inifo">{{info.row}}</span>
                也可以通过如下方式获得当前遍历好的每个用户的具体信息
                <span slot-scope="info">{{info.row.xxxx}}</span>
          -->
          <el-switch
            slot-scope="info"
            v-model="info.row.mg_state"
            @change="changeState(info.row.id, info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="delUser(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="角色分配"
              placement="top"
              :enterable="false"
            >
              <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 数据分页 -->
      <div class="block">
        <!-- 参数解释: @size-change: 每页信息条数变化的事件函数回调处理声明
            @current-change="handleCurrentChange": 当前页码变化事件函数回调
            :current-page : 当前默认页码
            :page-sizes : 制作每页条数下拉列表的
            :page-size : 默认每页记录条数设定
            :total : 总记录条数与每页显示条数 结合, 通过相关算法可以计算当前分页的"总页数"
        -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querycdt.pagenum"
          :page-sizes="[2, 5, 10, 15]"
          :page-size="querycdt.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="querycdt.tot"
        ></el-pagination>
      </div>

      <!-- 添加用户对话框 -->
      <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop>
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // 在生命周期函数中调用getUserInfos方法
  created() {
    this.getUserInfos()
  },
  methods: {
    // 修改用户相关1

    // 修改用户, 手机数据存储
    editUser() {
      // 校验表单
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          // 校验成功处理
          // 手机数据存储入库
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 修改成功处理: 关闭对话框, 成功提示, 页面数据更新
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 使得修改用户的对话框显示
    // param id: 被修改用户的id
    async showEditDialog(id) {
      // 修改editDialogVisible的值为true即可 (使得表单可见)
      this.editDialogVisible = true
      // 根据id或的修改用户的信息
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得到的用户信息赋予给editForm表单数据
      this.editForm = res.data
    },
    // 修改用户相关2

    // 删除功能
    delUser(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          // console.log(res)
          // console.log(123)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功: 消息提示, 刷新数据
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        })
        .catch(() => {})
    },

    // 收集数据存储入库(执行后端api数据接口)
    async addUser() {
      // 先校验from表单, validate
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 表单验证成功
          const { data: res } = await this.$http.post('users', this.addForm)
          // 添加失败
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 添加成功: 关闭对话框, 成功提示, 显示新添加用户
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 对话框关闭回调
    addDialogClose() {
      // 重置form表单, (如果不刷新页面, 再次点开还是上次出现的情况)
      this.$refs.addFormRef.resetFields()
    },
    editDialogClose() {
      // 重置form表单,
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户状态的方法
    // uid: 被修改状态用户的id值
    // state:被修改后的状态信息true/false
    async changeState(uid, state) {
      // console.log(uid, state)
      const { data: res } = await this.$http.put(
        'users/' + uid + '/state/' + state
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 提示修改状态成功的信息
      this.$message.success(res.meta.msg)
    },

    // 数据分页相关1
    // 每条记录条数变化的回调处理
    handleSizeChange(arg) {
      // arg: 变化后的记录条数
      //   console.log('-----------------')
      //   console.log(arg)
      this.querycdt.pagesize = arg
      // 重新根据条件获得数据
      this.getUserInfos()
    },
    // handleClose() {},
    // 当前页码变化的的回调处理
    handleCurrentChange(arg) {
      // arg: 变化后的当前页码值
      //   console.log('==============')
      //   console.log(arg)
      this.querycdt.pagenum = arg
      // 根据变化后的页码重新获得数据
      this.getUserInfos()
    },
    // 获得用于显示的真实用户列表数据
    async getUserInfos() {
      //   this.$http.get('/users', 条数/页码/关键字)
      // 一下axios发送请求的url格式为: http://主机名: 端口/xxx/users?query=&pagenum=1&pagesize=3
      const { data: res } = await this.$http.get('/users', {
        params: this.querycdt
      })
      // console.log('---------')
      // console.log(res)
      // 判断数据是否获得成功
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 记录总条数
      this.querycdt.tot = res.data.total
      // 把获取到的数据赋值给querycdt
      this.userInfos = res.data.users
    }
  },
  data() {
    // 为校验手机号码声明一个函数
    // var checkMobile = (rule, value被校验数据, callback回调方法) => {
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则, 1开始, 后接3|5|8|9|7, 再后边跟9为数字
      // 正则表达式
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error('手机号码格式不正确 '))
      }
      // 校验成功, 继续执行
      callback()
    }
    return {
      // 修改用户数据1
      // 控制修改用户对话框是否显示(true: 显示 false: 隐藏)
      editDialogVisible: false,
      editForm: {
        username: '',
        mobile: '',
        email: ''
      },
      // 制作表单域校验的规则
      editFormRules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户数据2

      // 添加用户相关1
      // 控制添加用户对话框是否显示(true: 显示 false: 隐藏)
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 制作表单域校验的规则
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 用户数据
      userInfos: [],
      // 给获取用户数据设置查询条件
      querycdt: {
        // 查询关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页获取记录条数
        pagesize: 3,
        // 总记录条数
        tot: 0
      }
      // table表格展示的demo数据, 结构是数组对象集
      //   tableData: [
      //     {
      //       date: '2016-05-02',
      //       name: '王小虎',
      //       address: '上海市普陀区金沙江路 1518 弄'
      //     },
      //     {
      //       date: '2016-05-04',
      //       name: '王小虎',
      //       address: '上海市普陀区金沙江路 1517 弄'
      //     },
      //     {
      //       date: '2016-05-01',
      //       name: '王小虎',
      //       address: '上海市普陀区金沙江路 1519 弄'
      //     },
      //     {
      //       date: '2016-05-03',
      //       name: '王小虎',
      //       address: '上海市普陀区金沙江路 1516 弄'
      //     }
      //   ]
    }
  }
}
</script>

<style lang="less" scoped>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
