<template>
  <div id="wrapper">
    <div class="row">
      <div class=hint>请输入URL：</div>
      <el-input class="input" v-model="url" placeholder="请输入URL"></el-input>
    </div>
    <div class="row">
      <div class=hint>请输入最小点：</div>
      <el-input class="input" v-model="minX" placeholder="请输入minX"></el-input>
      <el-input class="input" v-model="minY" placeholder="请输入minY"></el-input>
    </div>
    <div class="row">
      <div class=hint>请输入最大点：</div>
      <el-input class="input" v-model="maxX" placeholder="请输入maxX"></el-input>
      <el-input class="input" v-model="maxY" placeholder="请输入maxY"></el-input>
    </div>
    <div class="row">
      <div class=hint>请输入精度：</div>
      <el-input class="input" v-model="delta" placeholder="请输入delta"></el-input>
    </div>
    <el-button class="btn" type="primary" @click="this.handleClick" :loading="loading">start</el-button>
  </div>
</template>

<script>
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'landing-page',
    data () {
      return {
        loading: false,
        url: '',
        minX: '',
        minY: '',
        maxX: '',
        maxY: '',
        delta: ''
      }
    },
    methods: {
      handleClick () {
        if (this.loading) {
          return;
        }
        this.loading  = true
        if (this.url && this.minX && this.minY && this.maxX && this.maxY && this.delta) {
          this.$message({
            message: '已启动',
            type: 'success'
          });
          ipcRenderer.send('start', {
            url: this.url,
            minX: this.minX,
            minY: this.minY,
            maxX: this.maxX,
            maxY: this.maxY,
            delta: this.delta
          })
          this.loading = false
        } else {
          this.$message.error('请输入完整信息')
          this.loading = false
        }
      }
    }
  }
</script>

<style>
  #wrapper {
    width: 450px;
    height: auto;
  }
  .row {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    width: 100%;
    height: auto;
  }
  .hint {
    width: 120px;
    line-height: 40px;
  }
  .el-input {
    flex: 1;
    margin-right: 10px;
  }
  .el-button--primary {
    display: block !important;
    margin: 30px auto 0 auto !important;
  }
</style>
