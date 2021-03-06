import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CashPool from "../views/CashPool.vue";
import CashPool2 from "../views/CashPool2.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "pool",
        component: CashPool
    },
    {
        path: "/pool2",
        name: "pool2",
        component: CashPool2
    },
    {
        path: "/detail",
        name: "CashFlow",
        component: Home
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
