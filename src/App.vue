<template>
  <div id="app">
    <navigation></navigation>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Navigation from '@/components/Navigation.vue';
import Component from 'vue-class-component';

@Component({
  components:{
    Navigation
  } 
})
export default class Application extends Vue {
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
