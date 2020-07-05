import { onMounted, onUnmounted } from "@vue/composition-api";
import echarts from "echarts";
// import _ from "lodash";
import moment from "moment";

import expenseData from "../data/cash-expense";
import poolsData from "../data/pools";

export default function(graphElementId) {
    // let dailyData = null;
    let dailyChart = null;

    const getGraphOption = data => {
        return data;
        // return {
        //     tooltip: {
        //         trigger: "axis",
        //         axisPointer: {
        //             // 坐标轴指示器，坐标轴触发有效
        //             type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        //         }
        //     },
        //     legend: {
        //         data: []
        //         // left: 10,
        //     },
        //     xAxis: {
        //         data: data,
        //         name: "日期",
        //         axisLine: { onZero: true },
        //         splitLine: { show: false },
        //         splitArea: { show: false }
        //     },
        //     yAxis: {
        //         inverse: true,
        //         splitArea: { show: false }
        //     },
        //     grid: {
        //         left: 100
        //     },
        //     visualMap: {
        //         type: "continuous",
        //         dimension: 1,
        //         text: ["High", "Low"],
        //         inverse: true,
        //         itemHeight: 200,
        //         calculable: true,
        //         min: -2,
        //         max: 6,
        //         top: 60,
        //         left: 10,
        //         inRange: {
        //             colorLightness: [0.4, 0.8]
        //         },
        //         outOfRange: {
        //             color: "#bbb"
        //         },
        //         controller: {
        //             inRange: {
        //                 color: "#2f4554"
        //             }
        //         }
        //     },
        //     series: [
        //         {
        //             name: "bar",
        //             type: "bar",
        //             stack: "one",
        //             emphasis: emphasisStyle,
        //             data: data1
        //         },
        //         {
        //             name: "bar2",
        //             type: "bar",
        //             stack: "one",
        //             emphasis: emphasisStyle,
        //             data: data2
        //         },
        //         {
        //             name: "bar3",
        //             type: "bar",
        //             stack: "two",
        //             emphasis: emphasisStyle,
        //             data: data3
        //         },
        //         {
        //             name: "bar4",
        //             type: "bar",
        //             stack: "two",
        //             emphasis: emphasisStyle,
        //             data: data4
        //         }
        //     ]
        // };
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

        // if (_.isEmpty(rawData)) {
        //     console.log(`数据为空，不继续处理...`);
        //     return;
        // }
        // dailyData = rawData;
        // console.log(
        //     `数据长度：${
        //         dailyData && dailyData.data && dailyData.data.length
        //     }, ${rawData && rawData.tsCode}, %o`,
        //     rawData && rawData.info
        // );

        // let data = splitData(dailyData);
        let data = readAndDealData();
        let option = getGraphOption(data);

        dailyChart.setOption(option, true);
        dailyChart.resize();
        console.log("数据设置完毕！");
    };

    /**
     * 数据格式：
        pool: "众贡",
        customer: "平安财险甘肃分公司",
        project: "PCSBB1912021",
        period: 45,
        sales: "江传文",
        department: "上海二",
        loan: 1097500,
        loanDate: "2020/1/7",
        transactionAmount: 1091931.8,
        transactionDate: "2020/1/7",

        第一个输出数据用于堆叠柱状图，按照日期累计，累计按照不同的pool的loan
     */
    const readAndDealData = () => {
        console.log(`静态数据长度：${expenseData && expenseData.length}`);
        // 按照资金池数据，初始化叠加的基本数据
        let yLoans = [];
        for (let index = 0; index < poolsData.length; index++) {
            let pool = poolsData[index];
            yLoans.push({ name: pool, data: [] });
        }
        console.log(yLoans);

        // 先用日期填满x轴，然后
        let xAxis = [];
        let lastDay = moment("20200701");
        let firstDay = moment("20200101");
        for (; firstDay.isBefore(lastDay); firstDay.add(1, "d")) {
            xAxis.push(firstDay.format("YYYY-MM-DD"));
            for (let i = 0; i < yLoans.length; i++) {
                let yloan = yLoans[i];
                yloan.data.push(0);
            }
        }
        // console.log("初始化完成的y轴数据：%o", yLoans);

        firstDay = moment("2020-01-01");
        let count = 0;
        for (let i = 0; i < expenseData.length; i++) {
            let data = expenseData[i];
            if (data) {
                let loanDate = moment(data.loanDate);
                if (loanDate.isBefore(lastDay)) {
                    let index = loanDate.diff(firstDay, "days");
                    let pool = data.pool;
                    // console.log(`处理数据：%o, 索引位置${index}, ${pool}`, data);
                    for (let j = 0; j < yLoans.length; j++) {
                        let yloan = yLoans[j];
                        // console.log(`查找对应池：%o, ${pool}`, yloan);
                        if (yloan.name === pool) {
                            count += 1;
                            yloan.data[index] += data.loan;
                            break;
                        }
                    }
                }
            }
        }
        console.log(`共找到并处理了${count}条数据`);
        // console.log(xAxis, yLoans);
        return {
            x: xAxis,
            y: yLoans
        };
    };

    onMounted(() => {
        console.log("onMounted");
        // dataReady(props.data);
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
