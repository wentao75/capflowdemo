import { onMounted, onUnmounted } from "@vue/composition-api";
import _ from "lodash";
import echarts from "echarts";
import poolData from "../data/cash-pooling";

export default function(graphElementId, router) {
    let dailyChart = null;

    const getGraphOption = data => {
        if (_.isEmpty(data)) {
            console.log("数据为空，不能绘图, %o", data);
            return {};
        }

        // let legendData = [];
        // for (let pool of data) {
        //     legendData.push(pool.name);
        // }

        // 创建多个grid，分别放置柱形叠加
        let grids = [];
        let xAxis = [];
        let yAxis = [];
        let series = [];
        let count = data.length;
        for (let index = 0; index < count; index++) {
            grids.push({
                left: (index * 100) / count + 1 + "%",
                right: 101 - ((index + 1) * 100) / count + "%",
                bottom: "3%"
            });
            xAxis.push({
                type: "category",
                data: [data[index].name],
                gridIndex: index,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            });
            yAxis.push({
                type: "value",
                gridIndex: index,
                splitArea: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false },
                max: data[index].total
            });
            series.push({
                name: "可用",
                type: "bar",
                stack: data[index].name + "资金池",
                data: [data[index].available],
                xAxisIndex: index,
                yAxisIndex: index,
                label: {
                    show: true,
                    formatter: "{a}: {c}"
                }
            });
            series.push({
                name: "已用",
                type: "bar",
                stack: data[index].name + "资金池",
                data: [data[index].used],
                xAxisIndex: index,
                yAxisIndex: index,
                label: {
                    show: true,
                    formatter: "{a}: {c}"
                }
            });
            series.push({
                name: "总额",
                type: "scatter",
                data: [data[index].total],
                xAxisIndex: index,
                yAxisIndex: index,
                symbolSize: 1,
                label: {
                    show: true,
                    position: "top",
                    formatter: "{b}: {c}"
                }
            });
        }
        console.log(grids, xAxis, yAxis, series);

        return {
            color: ["#006699", "#c4ccd3"],
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: grids,
            // legend: {
            //     data: legendData
            // },
            xAxis,
            yAxis,
            series
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

        // 计算汇总
        let total = {
            name: "总计",
            total: 0,
            used: 0,
            available: 0
        };
        for (let pool of poolData) {
            total.total += pool.total;
            total.used += pool.used;
            total.available += pool.available;
            total.date = pool.date;
        }
        // poolData.unshift(total);
        return [total, ...poolData];
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
