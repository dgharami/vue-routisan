import { fixSlashes, arrayWrap, multiguard, arrayLast } from './util';
import shared from './shared';

export default {
    component ($this, component) {
        $this.config.component = shared.resolver(component);
    },
    components ($this, components) {
        $this.config.components = {};

        for (let name in components) {
            $this.config.components[name] = shared.resolver(components[name]);
        }
    },
    beforeEnter ($this, guard) {
        guard = arrayWrap(guard);

        $this._guards = $this._guards.concat(guard);

        $this.config.beforeEnter = multiguard($this._guards);
    },
    children ($this, routes) {
        shared.childStack.push([]);

        routes();

        $this.config.children = arrayLast(shared.childStack).map((route) => route.config);

        shared.childStack.pop();
    },
    meta ($this, meta) {
        $this.config.meta = Object.assign($this.config.meta, meta);
    },
    prefix ($this, prefix) {
        $this.config.path = fixSlashes([prefix, $this.config.path]);
    }
};
