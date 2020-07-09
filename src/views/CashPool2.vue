<template>
    <div id="graph" style="width=1000px;height=500px;"></div>
</template>

<script>
// @ is an alias to /src
import usePoolGraph from "../composable/use-pool2-graph";
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
#graph {
    width: 100%;
    height: 50%;
}
</style>
