import { Button as ChakraUIButton } from "@chakra-ui/react";
import { forwardRef } from "react";

const Button = forwardRef(({ children, primary = true, ...props }, ref) => (
    <ChakraUIButton
        bgColor={primary === true ? "blue" : "gray.500"}
        color="yellow"
        borderRadius={0}
        ref={ref}
        {...props}
    >
        {children}
    </ChakraUIButton>
));

export default Button;
