import { Button } from "@chakra-ui/button";

/**
 * @typedef SubmitProps
 * @property {String} [label="OK"]
 */

/**
 * A simple, primary submit button
 * @param {SubmitProps} props
 */
const Submit = ({ label, children, ...moreProps }) => (
	<Button
		type="submit"
		isFullWidth={true}
		variant="solid"
		colorScheme="green"
		className="submit"
		size="sm"
		borderRadius={0}
		mt={4}
		{...moreProps}
	>
		{children}
		{label}
	</Button>
);

export default Submit;
