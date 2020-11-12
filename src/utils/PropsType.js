export interface IPopup {
    navigator: INavigator;
    requestClose: () => {};
}

interface IScreenParams {
    screen: any;
    params: any;
    options?: {
        title?: string,
    };
}

export interface INavigator {
    present: () => {};
    show: (params: IScreenParams) => {};
    showLoading: () => {};
    hideLoading: () => {};
    showBottom: (params: IScreenParams) => {};
    dismiss: () => {};
    navigation: Object;
    routeMap: Object;
    push: (params: IScreenParams) => {};
    pop: () => {};
    popN: () => {};
    popToTop: () => {};
    replace: () => {};
}

export interface ScreenProps {
    bundleName: String;
    debugHost: String;
    hostId: String;
    miniAppId?: String;
    moduleName: String;
    options: Object;
    params?: Object;
    screen: String;
    navigator: INavigator;
}
