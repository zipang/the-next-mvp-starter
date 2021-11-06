import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import APIForm from "./APIForm.js";
import Text from "./inputs/Text.js";
import Email from "./inputs/Email.js";

export const SendMailReport = () => (
	<Box w="20rem" h="100%">
		<APIForm method="POST" action="/api/mailreport">
			<Text
				name="fullName"
				placeHolder="John DOE"
				autoFocus={true}
				required={true}
			/>
			<Email name="email" placeHolder="john.doe@x.org" required={true} />
			<Text name="message" placeHolder="Hello" />
			<Input
				type="submit"
				value="Envoyer"
				mt={4}
				borderRadius={0}
				_focus={{
					borderColor: "yellow"
				}}
				bgColor="blue"
				color="yellow"
			/>
		</APIForm>
	</Box>
);

export default {
	title: "API Form"
};
