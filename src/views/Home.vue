<template>
    <div class="vueroot">
        <div id="graph"></div>
        <el-table
            :data="details"
            stripe
            show-summary
            :summary-method="calculateSummaries"
            style="width: 100%"
        >
            <el-table-column prop="project" label="项目"></el-table-column>
            <el-table-column prop="customer" label="客户"></el-table-column>
            <el-table-column prop="loan" label="金额"></el-table-column>
            <el-table-column prop="loanDate" label="支出日期"></el-table-column>
            <el-table-column
                prop="writeOffAmount"
                label="核销金额"
            ></el-table-column>
            <el-table-column
                prop="returnDate"
                label="还款日期"
            ></el-table-column>

            <el-table-column prop="pool" label="资金池"></el-table-column>
        </el-table>
    </div>
</template>

<script>
// @ is an alias to /src
import useCapitalGraph from "../composable/use-capital-graph";

export default {
    name: "Home",
    setup() {
        const { details, calculateSummaries } = useCapitalGraph("graph");

        return { details, calculateSummaries };
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
    height: 30%;
}
</style>
