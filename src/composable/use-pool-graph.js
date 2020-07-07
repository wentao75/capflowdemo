import { onMounted, onUnmounted } from "@vue/composition-api";
import _ from "lodash";
import echarts from "echarts";
import poolData from "../data/cash-pooling";

export default function(graphElementId, router) {
    // let dailyData = null;
    let dailyChart = null;

    const getGraphOption = data => {
        if (_.isEmpty(data)) {
            console.log("数据为空，不能绘图, %o", data);
            return {};
        }

        // let series = [];
        let legendData = [];
        let avaliable = [];
        let used = [];
        let total = [];
        for (let pool of data) {
            legendData.push(pool.name);
            avaliable.push(pool.available);
            used.push(pool.used);
            total.push(pool.total);
        }
        console.log(legendData, avaliable, used, total);

        return {
            color: ["#006699", "#c4ccd3"],
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            legend: {
                data: legendData
            },
            xAxis: {
                type: "category",
                data: legendData,
                // name: "日期",
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
                // splitArea: { show: false }
            },
            yAxis: {
                try: "value",
                splitArea: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            series: [
                {
                    name: "可用",
                    type: "bar",
                    stack: "资金池",
                    data: avaliable,
                    label: {
                        show: true
                    }
                },
                {
                    name: "已用",
                    type: "bar",
                    stack: "资金池",
                    data: used,
                    label: {
                        show: true
                    }
                },
                {
                    name: "总额",
                    type: "scatter",
                    data: total,
                    symbolSize: 1,
                    label: {
                        show: true,
                        position: "top",
                        formatter: "{b}: {c}"
                    }
                }
            ]
        };
    };

    const dailyChartResize = () => {
        dailyChart.resize();
    };

    const dataReady = () => {
        console.log("处理数据 ...");
        let graphElement = document.getElementById(graphElementId);

        if (dailyChart === null) {
            dailyChart = echarts.init(graphElement);

            window.addEventListener("resize", dailyChartResize);
        }

        // let data = splitData(dailyData);
        let data = readAndDealData();
        let option = getGraphOption(data);

        dailyChart.setOption(option, true);
        dailyChart.resize();
        dailyChart.on("click", function(params) {
            alert(`您点击了${params.name}资金池的${params.seriesName}`);
            console.log("graph clicked: %o", params);
            router.push("/detail");
        });
        console.log("数据设置完毕！");
    };

    const readAndDealData = () => {
        console.log(`静态数据长度：${poolData && poolData.length}`);
        return poolData;
    };

    onMounted(() => {
        console.log("onMounted");
        dataReady();
    });

    onUnmounted(() => {
        console.log("onUnmounted");
        if (dailyChart !== null) {
            dailyChart.clear();
            dailyChart.dispose();
        }
        window.removeEventListener("resize", dailyChartResize);
    });

    return {};
}
