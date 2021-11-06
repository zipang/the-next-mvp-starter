import { Box } from "@chakra-ui/layout";

/**
 * @typedef GroupLabelProps
 * @property {String} label
 * @property {Boolean} [labelInside=true] Put the label inside the box
 */

/**
 * Label a group of controls
 * and draw a box around them
 * @param {GroupLabelProps} props
 */
const GroupLabel = ({ label = "", labelInside = true, children }) => (
	<>
		{!labelInside && (
			<Box as="label" display="block" width="100%" margin="1em 0 0 0.5em">
				<h3 style={{ marginBottom: 0 }}>
					<strong>{label}</strong>
				</h3>
			</Box>
		)}
		<Box
			marginTop="0.5em"
			marginBottom="0.5em"
			display="flex"
			flexWrap="wrap"
			flexGrow="1"
			padding="0.5em"
			border="1px solid #ccc"
		>
			{labelInside && (
				<Box as="label" display="block" width="100%" margin="0.1em 0 0.1em 0.5em">
					{label}
				</Box>
			)}
			{children}
		</Box>
	</>
);

export default GroupLabel;
