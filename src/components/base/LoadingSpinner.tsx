import { Text, VStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

/**
 * @typedef LoadingProps
 * @param {String} [message="Loading"]
 */
/**
 * Display a spinner with a loading message
 * @param {LoadingProps} props
 */
export const LoadingSpinner = ({ message = "Loading..." }) => {
	return (
		<VStack m={4} width="100%" height="100%">
			<Spinner width={32} height={32} color="blue.400" />
			<Text>{message}</Text>
		</VStack>
	);
};
