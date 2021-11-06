import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const global = {
	html: {
		fontSize: {
			xs: "14px",
			sm: "18px",
			md: "20px",
			lg: "22px",
			xl: "24px"
		}
	},
	body: {
		minWidth: "280px",
		overflowX: "hidden",
		"p, h1, h2, h3, h4": {
			"&::selection": {
				color: "white",
				backgroundColor: "cyan"
			}
		},
		"h1, h2, h3, h4": {
			textTransform: "uppercase"
		},
		a: {
			textDecoration: "underline"
		}
	}
};

const fonts = {
	heading: `Sora, Georgia, serif`,
	body: `Roboto, Helvetica, -apple-system, Oxygen, Cantarell, "Fira Sans",
    "Droid Sans", "Helvetica Neue", System, sans-serif`,
	mono: `'Menlo', monospace`
};

const breakpoints = createBreakpoints({
	sm: "40em",
	md: "52em",
	lg: "64em",
	xl: "80em"
});

const theme = extendTheme({
	colors: {
		black: "#16161D"
	},
	fonts,
	breakpoints,
	styles: { global }
});

export default theme;
