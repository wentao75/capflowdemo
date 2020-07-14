<template>
    <div class="vueroot">
        <div>
            <router-link to="/">样式1</router-link
            ><router-link to="/pool2">样式2</router-link>
        </div>
        <div id="graph"></div>
    </div>
</template>

<script>
// @ is an alias to /src
import usePoolGraph from "../composable/use-pool-graph";
// import { useRouter } from "../composable/use-router";

export default {
    name: "CashPool",
    setup(props, { root }) {
        // const router = useRouter();
        console.log("use router: %o", root.$router);
        usePoolGraph("graph", root.$router);

        return {};
    }
};
</script>
<style>
.vueroot {
    padding: 0 0 0 0;
    margin: 0 0 0 0;
    width: 100%;
    height: 100%;
}
#graph {
    width: 100%;
    height: 40%;
}
</style>
