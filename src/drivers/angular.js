
import { dasherizeToCamel, once } from '../lib';

export let angular = {

    isActive() {
        return Boolean(window.angular);
    },

    register(component) {

        let register = once((moduleName) => {

            window.angular.module(moduleName).directive(dasherizeToCamel(component.tag), () => {

                let scope = {};

                for (let key of Object.keys(component.props)) {
                    let prop = component.props[key];

                    if (prop.type === 'function' || prop.type === 'object') {
                        scope[key] = '=';
                    } else if (prop.type === 'string' || prop.type === 'boolean' || prop.type === 'number') {
                        scope[key] = '@';
                    } else {
                        throw new Error(`Unrecognized prop type: ${prop.type}`);
                    }
                }

                return {
                    scope,

                    controller: ($scope, $element) => {

                        component.log(`instantiate_angular_component`);

                        function getProps() {
                            let instanceProps = {};
                            for (let key of Object.keys(scope)) {
                                instanceProps[key] = $scope[key];
                            }
                            return instanceProps;
                        }

                        let parent = component.init(getProps());
                        parent.render($element[0]);

                        $scope.$watch(() => {
                            parent.updateProps(getProps());
                        });
                    }
                };
            });
        });


        let bootstrap = window.angular.bootstrap;

        window.angular.bootstrap = function(el, modules) {
            register(modules[0]);
            return bootstrap.apply(this, arguments);
        };

        let module = window.angular.module;

        window.angular.module = function(moduleName) {
            let result = module.apply(this, arguments);
            register(moduleName);
            return result;
        };
    }
};
