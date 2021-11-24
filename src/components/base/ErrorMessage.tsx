import { Center, Code } from "@chakra-ui/layout";
import { Paragraph } from "./Typography";

/**
 * @typedef ErrorMessageProps
 * @property {string|Error} error An error message or the original javascript error catched
 */
type ErrorMessageProps = {
	error: string | Error;
};
/**
 * Display an error
 * @param {ErrorMessageProps} props
 */
export const ErrorMessage = ({ error }: ErrorMessageProps) => (
	<Center>
		<Paragraph>
			{error instanceof Error ? (
				<>
					<Code color="red" fontWeight="bold">
						{error.message}
					</Code>
					<pre>{error.stack}</pre>
				</>
			) : (
				<Code color="red">{error}</Code>
			)}
		</Paragraph>
	</Center>
);

export default ErrorMessage;
