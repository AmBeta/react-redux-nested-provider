import React, { Component, Children, PropTypes } from 'react';
import { Provider } from 'react-redux';

const storeShape = PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
});

/**
 * A redux Provider for nesting a custom store.
 * 嵌套的 Provider，可以将父级的 store 与自身的进行合并
 * 如果遇到命名冲突，则优先取自身的 store 中的数据
 */
class NestedProvider extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = {
            ...props.store,
            getState: () => ({
                ...(context.store ? context.store.getState() : {}),
                ...(props.store ? props.store.getState() : {}),
            }),
        };
    }

    render() {
        const { children } = this.props;
        return (
            <Provider store={this.store}>
                {Children.only(children)}
            </Provider>
        );
    }
}

NestedProvider.propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired,
};

NestedProvider.contextTypes = {
    store: storeShape.isRequired,
};

/**
 * A React high order component or so called a component decorator
 * to provide the wrapped component a standalone redux store.
 *
 * @param {Redux.Store} store redux store
 * @return {React.Component}
 */
export const provider = store => (ChildComponent) => {
    const Wrapper = props => (
        <NestedProvider store={store}>
            <ChildComponent {...props} />
        </NestedProvider>
    );
    Wrapper.displayName = `WrappedProvider(${ChildComponent.displayName})`;
    return Wrapper;
};

export default NestedProvider;
