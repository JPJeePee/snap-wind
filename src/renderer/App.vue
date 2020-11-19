<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'snap-wind'
  }
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html,
  body,
  #app{
    width: 100%;
    height: 100%;
  }
  #app {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
