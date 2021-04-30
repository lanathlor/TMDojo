import React, { useContext, useState } from "react";
import { Button, Drawer, Select } from "antd";
import { Option } from "antd/lib/mentions";
import { SettingsContext } from "../../lib/contexts/SettingsContext";
import { LineTypes } from "../viewer/ReplayLines";
import Checkbox, { CheckboxChangeEvent } from "antd/lib/checkbox/Checkbox";
import Text from "antd/lib/typography/Text";

export const SidebarSettings = (): JSX.Element => {
    const [visible, setVisible] = useState(false);
    const { lineType, changeLineType, showBlocks, setShowBlocks } = useContext(SettingsContext);

    const onClose = () => {
        setVisible(false);
    };

    const toggleSidebar = () => {
        setVisible(!visible);
    };

    const onChangeLineType = (newLineTypeKey: string) => {
        const newLineType = LineTypes[newLineTypeKey];
        if (newLineType != undefined) {
            changeLineType(newLineType);
        }
    };

    const onChangeSetBlocks = (event: CheckboxChangeEvent) => {
        setShowBlocks(event.target.checked);
    };

    return (
        <div className="absolute right-0 m-8 z-10">
            <Button onClick={toggleSidebar} shape="round" size="large">
                Settings
            </Button>
            <Drawer
                title="Settings"
                placement="right"
                width={400}
                onClose={onClose}
                visible={visible}
            >
                <Text type="secondary" className="ml-2">
                    Line Type
                </Text>
                <Select className={"w-full"} value={lineType.name} onChange={onChangeLineType}>
                    {Object.keys(LineTypes).map((lineTypeKey) => {
                        const { name } = LineTypes[lineTypeKey];
                        return (
                            <Option key={name} value={lineTypeKey}>
                                {name}
                            </Option>
                        );
                    })}
                </Select>

                <Checkbox
                    className={"w-full py-6 select-none"}
                    onChange={onChangeSetBlocks}
                    checked={showBlocks}
                >
                    Show Blocks
                </Checkbox>
            </Drawer>
        </div>
    );
};
