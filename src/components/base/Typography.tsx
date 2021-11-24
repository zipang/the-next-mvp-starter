import { Code, Text } from "@chakra-ui/layout";

export const Paragraph = ({ children }) => <Text fontSize="1rem">{children}</Text>;

export const ErrorMessage = ({ children }) => (
	<Code color="red" fontWeight="bold">
		{children}
	</Code>
);
