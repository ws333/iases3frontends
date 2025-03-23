import { HStack } from "@lib/ui/css/stack";
import { Button, MenuView } from "radzionkit";
import { Text } from "radzionkit";
import { Hoverable } from "radzionkit/ui/base/Hoverable";
import { absoluteOutline } from "radzionkit/ui/css/absoluteOutline";
import { borderRadius } from "radzionkit/ui/css/borderRadius";
import { round } from "radzionkit/ui/css/round";
import { transition } from "radzionkit/ui/css/transition";
import { verticalPadding } from "radzionkit/ui/css/verticalPadding";
import { getColor } from "radzionkit/ui/theme/getters";
import { ReactNode } from "react";
import styled, { css } from "styled-components";

type MenuOptionKind = "regular" | "alert";

export interface MenuOptionProps {
    icon?: ReactNode;
    text: string;
    isSelected?: boolean;
    onSelect: () => void;
    kind?: MenuOptionKind;
    view?: MenuView;
}

interface ContentProps {
    kind: MenuOptionKind;
}

const Content = styled(HStack)<ContentProps>`
    ${transition};
    ${borderRadius.s}
    width: 100%;
    ${verticalPadding(2)};
    align-items: center;
    gap: 12px;

    ${({ kind }) =>
        ({
            regular: css`
                color: ${({ theme }) => theme.colors.text.toCssValue()};
            `,
            alert: css`
                color: ${({ theme }) => theme.colors.alert.toCssValue()};
            `,
        })[kind]};
`;

const Outline = styled.div`
    ${absoluteOutline(0, 0)};
    border: 2px solid ${getColor("primary")};
    ${round};
`;

export const MenuOption = ({
    text,
    icon,
    onSelect,
    isSelected,
    kind = "regular",
    view = "popover",
}: MenuOptionProps) => {
    if (view === "popover") {
        return (
            <Hoverable verticalOffset={0} onClick={onSelect}>
                <Content kind={kind}>
                    <Text style={{ display: "flex" }}>{icon}</Text>
                    <Text>{text}</Text>
                </Content>
            </Hoverable>
        );
    }

    return (
        <Button
            style={{ justifyContent: "flex-start", height: 56 }}
            kind={kind === "regular" ? "secondary" : "alert"}
            size="l"
            isRounded={true}
            key={text}
            onClick={onSelect}
        >
            <HStack alignItems="center" gap={8}>
                {icon} <Text>{text}</Text>
            </HStack>
            {isSelected && <Outline />}
        </Button>
    );
};
