<template>
  <div id="app">
    <!-- <h1>hello world</h1> -->
    <transition name="myanimation">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  .myanimation-enter-active {
    animation: bounce-in .6s;
  }

  @keyframes bounce-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
}
</style>
