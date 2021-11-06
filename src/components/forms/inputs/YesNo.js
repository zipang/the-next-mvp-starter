import Radio from "./Radio.js";

/**
 * HOC to display a boolean choice using 2 radio buttons
 *
 * @param {String} yes
 * @param {String} no
 * @return {Radio}
 */
const YesNo = (yes = "Yes", no = "No") => ({ ...props }) => (
	<Radio
		{...props}
		options={[
			{ code: "true", label: yes },
			{ code: "false", label: no }
		]}
		load={(val) => val.toString()}
		serialize={(val) => (val === "true" ? true : false)}
	/>
);

export default YesNo;
