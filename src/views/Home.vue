<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <HelloWorld msg="Welcome to Your Vue.js App" />
        <div id="graph"></div>
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import useCapitalGraph from "../composable/use-capital-graph";

export default {
    name: "Home",
    setup() {
        useCapitalGraph("graph");

        return {};
    },
    components: {
        HelloWorld
    }
};
</script>
