import { useRef, useEffect } from "react";

/**
 * @see https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
 * @param {Any} value
 */
const usePrevious = (value = {}) => {
	const ref = useRef();
	useEffect(() => {
		console.log(`Setting previous value`, value);
		ref.current = value;
	});
	return ref.current;
};
export default usePrevious;
