import React from 'react';

const WalkingContext = React.createContext();

export const WalkingProvider = WalkingContext.Provider;
export const WalkingConsumer = WalkingContext.Consumer;

export default WalkingContext;