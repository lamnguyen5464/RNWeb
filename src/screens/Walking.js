import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import MaxApi from '@momo-platform/max-api';
import WalkingHelper from '../api/WalkingHelper';
import MomoAsyncHelper from '../utils/MomoAsyncHelper';
import {
    WALKING_GRANTED_PERMISSION_EVENT,
    CONTACT_GRANTED_PERMISSION_EVENT,
} from '../utils/EventTypes';
import { ScreenProps, INavigator } from '../utils/PropsType';
import { WALKING_ONBOARDING_SHOWN } from '../utils/StoreKey';
import WalkingOnboarding from './WalkingOnboarding';
import { WalkingContactPermission, WalkingMain } from '../components';
import { WalkingProvider } from '../components/WalkingContext';
import { isToday } from '../utils/DateUtils';
import moment from 'moment';

const LOADING_STATUS = 0;
const ONBOARDING_STATUS = 1;
const CONTACT_PERMISSION_STATUS = 2;
const ACTIVE_STATUS = 3;

export let NavigatorAction: INavigator;

class Walking extends React.Component<ScreenProps> {
    constructor(props) {
        super(props);

        this.state = {
            walkingGranted: false,
            contactGranted: false,
            pageStatus: LOADING_STATUS,
        };

        this.walkingListener = null;
        this.contactListener = null;
    }

    async componentDidMount() {
        const props = this.props;

        const options = {
            headerShown: false,
        };
        props.navigator.navigation.setOptions(options);
        NavigatorAction = props.navigator;

        // Listeners
        if (!this.walkingListener) {
            this.walkingListener = DeviceEventEmitter.addListener(
                WALKING_GRANTED_PERMISSION_EVENT,
                () => {
                    console.log('walking permission granted!');
                    MaxApi.checkPermission('contacts', status => {
                        this.setState({
                            pageStatus: ACTIVE_STATUS,
                            walkingGranted: true,
                            contactStatus: status === 'granted',
                        });
                    });
                }
            );
        }

        if (!this.contactListener) {
            this.contactListener = DeviceEventEmitter.addListener(
                CONTACT_GRANTED_PERMISSION_EVENT,
                async () => {
                    console.log('contact permission granted ');
                    const walkingStatus = await WalkingHelper.getFitnessPermission();
                    this.setState({
                        pageStatus: ACTIVE_STATUS,
                        walkingGranted: walkingStatus,
                        contactGranted: true,
                    });
                }
            );
        }

        const contactStatus = await WalkingHelper.getContactPermission();
        const walkingStatus = await WalkingHelper.getFitnessPermission();
        const res = await MomoAsyncHelper.getItemAsync(WALKING_ONBOARDING_SHOWN);

        this.setState({
            walkingGranted: walkingStatus,
            contactGranted: contactStatus === 'granted',
            pageStatus: res ? ACTIVE_STATUS : ONBOARDING_STATUS,
        });
    }

    componentWillUnmount() {
        this.walkingListener?.remove();
        this.contactListener?.remove();
        NavigatorAction = undefined;
    }

    onBoardingFinish() {
        MaxApi.checkPermission('contacts', status => {
            this.setState({
                ...this.state,
                pageStatus: status === 'granted' ? ACTIVE_STATUS : CONTACT_PERMISSION_STATUS,
            });
        });
    }

    onDoneContactPermission() {
        MaxApi.checkPermission('contacts', async status => {
            if (status === 'granted') {
                DeviceEventEmitter.emit(CONTACT_GRANTED_PERMISSION_EVENT);
            } else {
                this.setState({
                    ...this.state,
                    pageStatus: ACTIVE_STATUS,
                });
            }
        });
    }

    render() {
        const { pageStatus, walkingGranted, contactGranted } = this.state;
        const props = this.props;

        switch (pageStatus) {
            case LOADING_STATUS:
                return null;
            case ONBOARDING_STATUS:
                return (
                    <WalkingOnboarding
                        data={props.params?.onboardingSlides}
                        onBoardingFinish={() => this.onBoardingFinish()}
                    />
                );
            case CONTACT_PERMISSION_STATUS:
                return <WalkingContactPermission onDone={() => this.onDoneContactPermission()} />;
            default:
                return (
                    <WalkingProvider
                        value={{
                            walkingGranted,
                            contactGranted,
                            permissionParams: props.params?.permission,
                        }}
                    >
                        <WalkingMain params={props.params} />
                    </WalkingProvider>
                );
        }
    }
}

export default React.memo(Walking);
