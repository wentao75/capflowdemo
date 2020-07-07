import { provide, inject } from "@vue/composition-api";

// 数据key
const RouterSymbol = Symbol();

export function provideRouter(router) {
    provide(RouterSymbol, router);
}

export function useRouter() {
    const router = inject(RouterSymbol);
    if (!router) {
        console.error("没有读取到router对象！！！");
    }
    return router;
}
