
import { internalProps } from './props';
import { PROP_TYPES_LIST, CONTEXT_TYPES_LIST } from '../../constants';

function validateProps(options) {

    if (options.props && !(typeof options.props === 'object')) {
        throw new Error(`[${options.tag}] Expected options.props to be an object`);
    }

    if (options.props) {
        for (let key of Object.keys(options.props)) {
            let prop = options.props[key];

            if (internalProps.hasOwnProperty(key)) {
                throw new Error(`[${options.tag}] Reserved prop name: ${key}`);
            }

            if (!prop || !(typeof prop === 'object')) {
                throw new Error(`[${options.tag}] Expected options.props.${key} to be an object`);
            }

            if (!prop.type) {
                throw new Error(`[${options.tag}] Expected prop.type`);
            }

            if (PROP_TYPES_LIST.indexOf(prop.type) === -1) {
                throw new Error(`[${options.tag}] Expected prop.type to be one of ${PROP_TYPES_LIST.join(', ')}`);
            }

            if (prop.required && prop.def) {
                throw new Error(`[${options.tag}] Required prop can not have a default value`);
            }
        }
    }
}

export function validate(options) { // eslint-ignore-line

    if (!options.tag || !options.tag.match(/^[a-z0-9-]+$/)) {
        throw new Error(`Invalid options.tag: ${options.tag}`);
    }

    validateProps(options);

    if (options.contexts) {
        let anyEnabled = false;

        for (let context of Object.keys(options.contexts)) {

            if (CONTEXT_TYPES_LIST.indexOf(context) === -1) {
                throw new Error(`[${options.tag}] Unsupported context type: ${context}`);
            }

            if (options.contexts[context] || options.contexts[context] === undefined) {
                anyEnabled = true;
            }
        }

        if (!anyEnabled) {
            throw new Error(`[${options.tag}] No context type is enabled`);
        }

        if (options.contexts.iframe !== false) {
            if (!options.dimensions || !options.dimensions.width || !options.dimensions.height) {
                throw new Error(`[${options.tag}] dimesions.width and dimensions.height required for rendering to iframe`);
            }
        }
    }

    if (options.defaultContext) {
        if (CONTEXT_TYPES_LIST.indexOf(options.defaultContext) === -1) {
            throw new Error(`[${options.tag}] Unsupported context type: ${options.defaultContext}`);
        }

        if (options.contexts && !options.contexts[options.defaultContext]) {
            throw new Error(`[${options.tag}] Disallowed default context type: ${options.defaultContext}`);
        }
    }

    if (options.envUrls) {
        for (let env of Object.keys(options.envUrls)) {
            if (!options.envUrls[env]) {
                throw new Error(`[${options.tag}] No url specified for env: ${env}`);
            }
        }
    }

    if (options.defaultEnv && !options.envUrls) {
        throw new Error(`[${options.tag}] options.envUrls must be set if passing in a defaultEnv`);
    }

    if (options.defaultEnv && !options.envUrls[options.defaultEnv]) {
        throw new Error(`[${options.tag}] Invalid default env: ${options.defaultEnv}`);
    }

    if (!options.url || !(typeof options.url === 'string')) {
        if (!options.defaultEnv || typeof options.defaultEnv !== 'string') {
            if (options.envUrls) {
                throw new Error(`[${options.tag}] Expected options.defaultEnv to be a string`);
            } else {
                throw new Error(`[${options.tag}] Expected options.url to be a string`);
            }
        }
    }
}