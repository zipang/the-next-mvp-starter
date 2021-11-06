export const logCallStack = () => {
	try {
		throw new Error("Loging Stack Trace");
	} catch (err) {
		console.log(err.stack);
	}
};
