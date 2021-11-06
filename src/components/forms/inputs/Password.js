import Text from "./Text.js";

/**
 * Take every exposed properties from Text but change type to password
 * @param {TextInputProps} props
 */
const Password = ({ ...props }) => <Text type="password" {...props} />;

export default Password;
