<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { provideRouter } from "./composable/use-router.js";

export default {
    setup(props, { root: { $route } }) {
        console.log("provide router: %o", $route);
        provideRouter($route);
    },
    name: "app",
    components: {}
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
}

#nav {
    padding: 30px;
    height: 22px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>
