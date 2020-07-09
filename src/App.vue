<template>
    <div id="app">
        <div style="width=100%;height=20px;text-align=left;">
            <router-link to="/">样式1</router-link>
            <router-link to="/pool2">样式2</router-link>
        </div>
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
