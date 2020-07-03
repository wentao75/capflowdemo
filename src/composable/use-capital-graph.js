import { onMounted, onUnmounted } from "@vue/composition-api";
import echarts from "echarts";
import _ from "lodash";

export default function(store, graphElementId) {
    let dailyData = null;
    let dailyChart = null;

    const getGraphOption = data => {};

    const dailyChartResize = () => {
        dailyChart.resize();
    };

    const dataReady = rawData => {
        console.log("trend 处理数据 ...");
        let graphElement = document.getElementById(graphElementId);

        if (dailyChart === null) {
            dailyChart = echarts.init(graphElement);

            window.addEventListener("resize", dailyChartResize);
        }

        if (_.isEmpty(rawData)) {
            console.log(`数据为空，不继续处理...`);
            return;
        }
        dailyData = rawData;
        console.log(
            `日线数据长度：${dailyData &&
                dailyData.data &&
                dailyData.data.length}, ${rawData && rawData.tsCode}, %o`,
            rawData && rawData.info
        );

        let data = splitData(dailyData);
        let option = getGraphOption(data);

        dailyChart.setOption(option, true);
        dailyChart.resize();
        console.log("trend 数据设置完毕！");
    };

    onMounted(() => {
        console.log("trend onMounted");
        dataReady(props.data);
        // if (dailyChart) {
        //     dailyChart.resize();
        // }
        // watchEffect(() => {
        // watch(props, () => {
        //     dataReady(); //props.dailyData);
        // });
    });

    onUnmounted(() => {
        console.log("trend onUnmounted");
        if (dailyChart !== null) {
            dailyChart.clear();
            dailyChart.dispose();
        }
        window.removeEventListener("resize", dailyChartResize);
    });

    return {};
}
