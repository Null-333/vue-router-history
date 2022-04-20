import Vue from 'vue';

let _Vue = null;
export default class VueRouter {
    static install(Vue) {
        _Vue = Vue;
        _Vue.mixin({
            // 把创建Vue实例的时候传入router对象注入到Vue实例上
            beforeCreate() {
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router;
                }
            },
        });
    }
    constructor(params) {
        this.data = Vue.observable({
            current: '/',
        });
        this.options = params.routes;
        this.routeMap = {};
        this.init();
    }
    init() {
        this.createRouteMap();
        this.initComponents();
        this.initEvent();
    }
    createRouteMap() {
        this.options.forEach(item => {
            this.routeMap[item.path] = item.component;
        });
    }
    initComponents() {
        const self = this;
        _Vue.component('router-link', {
            props: {
                to: String,
            },
            render(h) {
                return h('a', {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: (e) => {
                            e.preventDefault();
                            self.data.current = this.to;
                            history.pushState({}, '', this.to);
                        }
                    },
                }, this.$slots.default);
            },
        });
        _Vue.component('router-view', {
            render(h) {
                const component = self.routeMap[self.data.current]
                return h(component);
            },
        });
    }
    initEvent() {
        window.onpopstate = (e) => {
            this.data.current = window.location.pathname;
        }
    }
}
