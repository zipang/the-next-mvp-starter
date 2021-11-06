import { Box } from "@chakra-ui/react";

/**
 * Centered, responsive container
 */
const Container = ({ children, ...moreStyles }) => (
	<Box
		className="container"
		width="100%"
		height="100%"
		position="relative"
		m="0 auto"
		maxWidth={{
			sm: "95%",
			lg: "75%",
			xl: "65ch"
		}}
		{...moreStyles}
	>
		{children}
	</Box>
);

export default Container;
