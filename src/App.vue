<template>
  <div id="app">
    <div id="nav" v-show="false">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      | <router-link to="/layout">Layout</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
  data(){
    return {

    }
  },
  components: {
  },
  mounted() {
    const hash = window.location.hash;
      if (hash === '' || hash === '#/') {
          window.location.hash = '/layout';
      }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}
</style>
