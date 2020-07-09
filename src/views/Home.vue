<template>
    <div id="graph" style="width=1000px;height=500px;"></div>
</template>

<script>
// @ is an alias to /src
import useCapitalGraph from "../composable/use-capital-graph";

export default {
    name: "Home",
    setup() {
        const { details } = useCapitalGraph("graph");

        return { details };
    }
};
</script>
<style>
#graph {
    width: 100%;
    height: 50%;
}
</style>
