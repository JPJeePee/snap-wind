<template>
  <div id="wrapper">
    <div class="row">
      <el-button type="primary" @click="onChoosePath">选择下载文件夹</el-button>
      <div class="path">{{path}}</div>
    </div>
    <div class="row">
      <div class="hint">请输入URL：</div>
      <el-input class="input" v-model="url" placeholder="请输入URL"></el-input>
    </div>
    <div class="row">
      <div class="hint">请输入最小点：</div>
      <el-input class="input" v-model="minX" placeholder="请输入minX"></el-input>
      <el-input class="input" v-model="minY" placeholder="请输入minY"></el-input>
    </div>
    <div class="row">
      <div class="hint">请输入最大点：</div>
      <el-input class="input" v-model="maxX" placeholder="请输入maxX"></el-input>
      <el-input class="input" v-model="maxY" placeholder="请输入maxY"></el-input>
    </div>
    <div class="row">
      <div class="hint">精度和并发数：</div>
      <el-input class="input" v-model="delta" placeholder="请输入delta"></el-input>
      <el-input class="input" v-model="parallel" placeholder="请输入并发数"></el-input>
    </div>
    <el-button class="btn" type="primary" @click="this.handleClick" :loading="loading">start</el-button>
    <div class="values">
      <div class="value">全部：{{total}}</div>
      <div class="value">正在请求：{{running}}</div>
      <div class="value">等待请求：{{finished}}</div>
    </div>
  </div>
</template>

<script>
const ipcRenderer = require("electron").ipcRenderer;

export default {
  name: "landing-page",
  data() {
    return {
      loading: false,
      path: "",
      url: "https://globalwindatlas.info/api/gwa/custom/windSpeedRose",
      minX: "30",
      minY: "40",
      maxX: "31",
      maxY: "41",
      delta: "0.1",
      parallel: "50",
      total: 0,
      running: 0,
      finished: 0
    };
  },
  mounted() {
    ipcRenderer.on("running", (e, values) => {
      console.log(values)
      this.total = values.total;
      this.running = values.running;
      this.finished = values.finished
    });
    ipcRenderer.on("success", () => {
      alert("success");
    });
  },
  methods: {
    onChoosePath() {
      this.$nextTick(() => {
        const path = ipcRenderer.sendSync("open-folder");
        console.log(path);
        this.path = path;
      });
    },
    handleClick() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      if (
        this.url &&
        this.minX &&
        this.minY &&
        this.maxX &&
        this.maxY &&
        this.delta &&
        this.path &&
        this.parallel
      ) {
        this.$message({
          message: "已启动",
          type: "success"
        });
        ipcRenderer.send("start", {
          url: this.url,
          minX: +this.minX,
          minY: +this.minY,
          maxX: +this.maxX,
          maxY: +this.maxY,
          delta: +this.delta,
          path: this.path,
          parallel: +this.parallel
        });
        this.loading = false;
      } else {
        this.$message.error("请输入完整信息");
        this.loading = false;
      }
    }
  }
};
</script>

<style>
#wrapper {
  width: 450px;
  height: auto;
}
.row {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 10px;
  width: 100%;
  height: auto;
}
.path {
  margin: 30px auto 0 auto !important;
}
.hint {
  width: 120px;
  line-height: 40px;
}
.values {
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 30px;
  width: 450px;
}
.value {
  flex: 1;
  text-align: center;
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
