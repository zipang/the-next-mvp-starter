import { Box, Center, Heading } from "@chakra-ui/layout";
import { withContainerLayout } from "src/layouts/ContainerLayout";

const IndexPage = () => (
	<Box as="section" mt={10}>
		<Center>
			<Heading>CHAKRA IS HERE</Heading>
		</Center>
	</Box>
);

export default withContainerLayout(IndexPage, true);
