import { Heading, VStack } from "@chakra-ui/layout";
import { withContainerLayout } from "src/layouts/ContainerLayout";

const IndexPage = () => (
	<VStack bg="white" mt={6} p={4} boxShadow={10} height="50vh">
		<Heading>
			<i>Introducing</i> THE NEXT FIRESTORE STARTUP TEMPLATE
		</Heading>
	</VStack>
);

export default withContainerLayout(IndexPage, true);
