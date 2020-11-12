import React from 'react';

// * This component helped user handle setState when component unmount
// ! You must defined this
// componentDidMount() {
//     super.componentDidMount();
// }
// componentWillUnmount() {
//     super.componentWillUnmount();
// };
export default class BaseComponent<P = {}, S = {}, SS = any> extends React.PureComponent<P, S, SS> {
    mounted = false;

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setState(newState, callback) {
        if (this.mounted) {
            super.setState(newState, callback);
        }
    }

    forceUpdate() {
        if (this.mounted) {
            this.forceUpdate();
        }
    }
}
