import { onMounted, onUnmounted, ref } from "@vue/composition-api";
import echarts from "echarts";
import _ from "lodash";
import moment from "moment";

//import expenseData from "../data/cash-expense";
import poolsData from "../data/pools";
import hrData from "../data/cash-hr";
import ofData from "../data/cash-of";
import zgData from "../data/cash-zg";
import zjData from "../data/cash-zj";

export default function(graphElementId) {
    let details = ref([]);

    let minDay = moment("20200601");
    let maxDay = moment("20200703");
    // let dailyData = null;
    let flowdata = [];
    let dailyChart = null;
    let series = [];

    const getGraphOption = data => {
        // 首先从绘图数据中获得
        // return data;
        if (_.isEmpty(data) || _.isEmpty(data.x)) {
            console.log("数据为空，不能绘图, %o", data);
            return {};
        }

        series = [];
        let legendData = [];
        for (let pool of poolsData) {
            legendData.push(pool);
        }
        // legendData.push("支出");
        for (let yloan of data.y1) {
            series.push({
                name: yloan.name, // + "支出",
                type: "bar",
                data: yloan.data,
                stack: "支出",
                emphasis: {
                    itemStyle: {
                        shadowBlur: 8,
                        shadownOffsetX: 0,
                        shadowColor: "rgba(0,0,0,1)"
                    }
                }
            });
        }
        for (let y2 of data.y2) {
            series.push({
                name: y2.name, // + "回款",
                type: "bar",
                data: y2.data,
                stack: "回款"
            });
        }
        console.log(`图序列参数：%o`, series);
        return {
            color: [
                "#61a0a8",
                "#d48265",
                "#006699",
                "#e5323e",
                "#546570",
                "#c4ccd3",
                "#ca8622",
                "#91c7ae",
                "#749f83",
                "#bda29a",
                "#6e7074",
                "#2f4554"
            ],
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "15%",
                containLabel: true
            },
            legend: {
                data: legendData
            },
            xAxis: {
                type: "category",
                data: data.x,
                // name: "日期",
                axisLine: { onZero: true },
                splitLine: { show: false },
                splitArea: { show: false }
            },
            yAxis: {
                try: "value",
                splitArea: { show: false }
            },
            dataZoom: [
                {
                    type: "inside",
                    //start: 94,
                    start: 0,
                    end: 100
                },
                {
                    show: true,
                    type: "slider",
                    top: "90%",
                    //start: 94,
                    start: 0,
                    end: 100
                }
            ],
            series
        };
    };

    const dailyChartResize = () => {
        dailyChart.resize();
    };

    let selectedDataIndex = -1;
    const onGraphClick = params => {
        console.log(`点击信息：%o`, params);
        // 下面是数据点位置，可以用于计算出
        // params.dataIndex;
        // 高亮选择的数据位置
        let seriesIndex = [];
        for (let i = 0; i < series.length; i++) {
            seriesIndex.push(i);
        }

        if (selectedDataIndex >= 0) {
            dailyChart.dispatchAction({
                type: "unfocusNodeAdjacency",
                seriesIndex: seriesIndex,
                dataIndex: selectedDataIndex
            });
        }

        console.log("hight: %o, %i", seriesIndex, params.dataIndex);
        selectedDataIndex = params.dataIndex;
        dailyChart.dispatchAction({
            type: "focusNodeAdjacency",
            seriesIndex: seriesIndex,
            dataIndex: selectedDataIndex
        });
        // 这里的设置效果实际操作中看不出效果，原因是图形在当前鼠标对应到柱图时，已经设置高亮显示，这个显示效果在鼠标移动后会重制，造成设置无效！

        // 根据当前点击重新设置显示值
        let selectedDate = moment(minDay).add(params.dataIndex - 1, "d");
        let sdate = selectedDate.format("YYYY/M/D");
        details.value = flowdata.filter(data => {
            return data.loanDate === sdate || data.returnDate === sdate;
        });
        console.log(
            `选择条件：${params.dataIndex}, ${sdate}, 选择后的数据：%o`,
            details.value
        );
    };

    // let currentIndex = -1;
    // let dataLen = -1;
    const dataReady = () => {
        console.log("处理数据 ...");
        let graphElement = document.getElementById(graphElementId);

        if (dailyChart === null) {
            dailyChart = echarts.init(graphElement);

            window.addEventListener("resize", dailyChartResize);
        }

        let data = readAndDealData();
        let option = getGraphOption(data);

        dailyChart.setOption(option, true);
        dailyChart.resize();
        dailyChart.on("click", onGraphClick);
        // dailyChart.on("mousemove", params => {
        //     console.log(`mousemove: %o, ${selectedDataIndex}`, params);
        //     if (
        //         // params.dataIndex === selectedDataIndex &&
        //         selectedDataIndex >= 0
        //     ) {
        //         let seriesIndex = [];
        //         for (let i = 0; i < series.length; i++) {
        //             seriesIndex.push(i);
        //         }
        //         dailyChart.dispatchAction({
        //             type: "highlight",
        //             seriesIndex: seriesIndex,
        //             dataIndex: selectedDataIndex
        //         });
        //     }
        // });
        // setInterval(function() {
        //     dailyChart.dispatchAction({
        //         type: "downplay",
        //         seriesIndex: [0, 1, 2, 3, 4, 5, 6, 7],
        //         dataIndex: currentIndex
        //     });
        //     currentIndex = (currentIndex + 1) % dataLen;
        //     dailyChart.dispatchAction({
        //         type: "highlight",
        //         seriesIndex: [0, 1, 2, 3, 4, 5, 6, 7],
        //         dataIndex: currentIndex
        //     });
        // }, 1000);
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
        let expenseData = [...zgData, ...hrData, ...zjData, ...ofData];
        console.log(`静态数据长度：${expenseData && expenseData.length}`);
        for (let data of expenseData) {
            // 每一行数据需要拆分出支出和回款两天数据，回款可能没有，则计算计划回款（这次暂时不处理）
            let returnDate = data.returnDate;
            if (_.isEmpty(data.returnDate)) {
                let dd = moment(data.loanDate).add(data.period, "d");
                returnDate = dd.format("YYYY/M/D");
            }
            flowdata.push({
                project: data.project,
                customer: data.customer,
                loan: data.loan,
                loanDate: data.loanDate,
                returnDate,
                sales: data.sales,
                pool: data.pool
            });
        }
        flowdata.sort((a, b) => {
            return moment(b.loanDate).isBefore(moment(a.loanDate));
        });
        // 设置返回数据
        details.value = flowdata;

        // 按照资金池数据，初始化叠加的基本数据
        let yLoans = [];
        let yReturns = [];
        for (let pool of poolsData) {
            yLoans.push({ name: pool, data: [] });
            yReturns.push({ name: pool, data: [] });
        }
        console.log(yLoans, yReturns);

        // 先用日期填满x轴，然后
        let xAxis = [];
        // 这里直接从静态数据找到日期最大和最小

        let lastDay = moment("20200703");
        let firstDay = moment("20181225");
        for (; firstDay.isBefore(lastDay); firstDay.add(1, "d")) {
            if (firstDay.isBefore(minDay) || firstDay.isAfter(maxDay)) {
                continue;
            }

            xAxis.push(firstDay.format("YYYY-MM-DD"));
            for (let yloan of yLoans) {
                yloan.data.push(0);
            }
            for (let yReturn of yReturns) {
                yReturn.data.push(0);
            }
        }
        // console.log("初始化完成的y轴数据：%o", yLoans);

        firstDay = minDay;
        let count = 0;
        for (let data of expenseData) {
            if (data) {
                let loanDate = moment(data.loanDate);
                if (loanDate.isAfter(maxDay) && loanDate.isBefore(minDay)) {
                    continue;
                } else {
                    let index = loanDate.diff(firstDay, "days");
                    let pool = data.pool;
                    // console.log(`处理数据：%o, 索引位置${index}, ${pool}`, data);
                    for (let yloan of yLoans) {
                        // console.log(`查找对应池：%o, ${pool}`, yloan);
                        if (yloan.name === pool) {
                            count += 1;
                            yloan.data[index] -= data.loan;
                            break;
                        }
                    }
                    for (let yReturn of yReturns) {
                        if (yReturn.name === pool) {
                            yReturn.data[index] += data.writeOffAmount;
                            break;
                        }
                    }
                }
            }
        }
        // dataLen = xAxis.length;
        console.log(`共找到并处理了${count}条数据`);
        // console.log(xAxis, yLoans);
        return {
            x: xAxis,
            y1: yLoans,
            y2: yReturns
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

    // 返回要显示的数据，在图上选择会调整显示内容
    return {
        details
    };
}
