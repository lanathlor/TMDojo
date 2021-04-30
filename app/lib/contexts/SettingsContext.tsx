import React, { createContext, useState } from "react";
import { LineType, LineTypes } from "../../components/viewer/ReplayLines";

export interface SettingsContextProps {
    lineType: LineType;
    changeLineType: (lineType: LineType) => void;
    showBlocks: boolean;
    setShowBlocks: (showBlocks: boolean) => void;
}

const defaultProps: SettingsContextProps = {
    lineType: LineTypes.default,
    changeLineType: () => {},
    showBlocks: true,
    setShowBlocks: () => {},
};

export const SettingsContext = createContext<SettingsContextProps>(defaultProps);

export const SettingsProvider = ({ children }: any): JSX.Element => {
    const [lineType, setLineType] = useState(defaultProps.lineType);
    const [showBlocks, setShowBlocks] = useState(defaultProps.showBlocks);

    const changeLineType = (lineType: LineType) => {
        setLineType(lineType);
    };

    return (
        <SettingsContext.Provider
            value={{
                lineType,
                changeLineType,
                showBlocks,
                setShowBlocks,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
