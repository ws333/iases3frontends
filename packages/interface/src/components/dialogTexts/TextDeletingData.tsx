import { Button, Text } from "radzionkit";
import { CSSProperties } from "styled-components";
import { exportFromLocalStorage } from "../../helpers/exportFromLocalStorage";

const onClickButton = () => {
    exportFromLocalStorage();
};

const styles: CSSProperties = {
    margin: 0,
};

const TextDeletingData = (
    <>
        <Text color="supporting" style={styles}>
            You are about to delete all sending history!
        </Text>
        <Text color="supporting" style={styles}>
            This means that information about last sending date and sending count to individual contacts will be
            removed.
        </Text>
        <Text color="supporting" style={styles}>
            If you intend to continue sending later or on another computer make sure to export the data first!
        </Text>
        <Button onClick={onClickButton} style={{ margin: "1rem" }}>
            Export data
        </Button>
        <Text color="regular" style={{ ...styles, textAlign: "center" }}>
            Are you sure you want to delete the sending history?
        </Text>
    </>
);

export default TextDeletingData;
