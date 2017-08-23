import React from 'react';
import { provider } from '@hualala/platform-base';
import { getComponent } from './routes';
import { store } from './redux/configureStore';

class MerchantCenter extends React.Component {
    render() {
        const { metaData } = this.props;
        const PageComponent = getComponent(metaData);
        return PageComponent ? (
            <PageComponent {...this.props} />
        ) : (
            <div>{metaData}</div>
        );
    }
}

export default provider(store)(MerchantCenter);
