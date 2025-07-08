import styled from "styled-components";

type ErrorMessageProps = {
    errorMessage: string;
};

const StyledErrorMessage = styled.p`
    color: ${({ theme }) => theme.colors.alert.toCssValue()};
    /* Use CSS variable in EmailSender.css to match add-on sizing */
    max-width: calc(var(--container-add-on-max-width) - 13rem);
    text-align: center;
    word-wrap: break-word;
    overflow-wrap: break-word;
`;

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => {
    return <StyledErrorMessage>{errorMessage}</StyledErrorMessage>;
};

export default ErrorMessage;
