import { Center, Code } from "@chakra-ui/layout";

/**
 * @typedef ErrorMessageProps
 * @property {Error} error The original javascript error catched
 */
/**
 * Display an error
 * @param {ErrorMessageProps} props
 */
export const ErrorMessage = ({ error }) => (
	<Center>
		<p>
			<Code color="red">{error.message}</Code>
			<pre>{error.stack}</pre>
		</p>
	</Center>
);
