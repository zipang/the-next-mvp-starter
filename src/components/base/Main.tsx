import { useColorMode, VStack } from "@chakra-ui/react";

export const Main = ({ children, ...props }) => {
	const { colorMode } = useColorMode();
	const bgColor = { light: "gray.50", dark: "gray.900" };
	const color = { light: "black", dark: "white" };

	return (
		<VStack
			as="main"
			m="0"
			w="100%"
			minH="100vh"
			position="relative"
			bg={bgColor[colorMode]}
			color={color[colorMode]}
			{...props}
		>
			{children}
		</VStack>
	);
};
