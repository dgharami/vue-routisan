import Route from './Route';
import shared from './shared';
import { groupMerge, filterOptions, arrayLast } from './util';

export default class Routisan {
    constructor () {
        this._routes = [];
        this._groupStack = [];
    }

    setViewResolver (resolver) {
        shared.resolver = resolver;
    }

    _addRoute (path, key, value) {
        const route = new Route(path, key, value);

        if (shared.isRoot()) {
            if (this._groupStack.length) {
                route.options(arrayLast(this._groupStack));
            }

            this._routes.push(route);
        } else {
            arrayLast(shared.childStack).push(route);
        }

        return route;
    }

    view (path, component) {
        const key = (typeof component === 'object' && !component.__file ? 'components' : 'component');

        return this._addRoute(path, key, component);
    }

    redirect (path, redirect) {
        return this._addRoute(path, 'redirect', redirect);
    }

    group (options, routes) {
        this._updateGroupStack(options);

        routes();

        this._groupStack.pop();
    }

    _updateGroupStack (options) {
        options = filterOptions(options, ['beforeEnter', 'prefix', 'meta']);

        if (this._groupStack.length) {
            options = groupMerge(options, arrayLast(this._groupStack));
        }

        this._groupStack.push(options);
    }

    all () {
        return this._routes.map((route) => route.config);
    }
}
