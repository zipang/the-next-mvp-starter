import Container from "components/base/Container";
import DarkModeSwitcher from "components/base/DarkModeSwitcher";
import { Main } from "components/base/Main";

export const ContainerLayout = ({ children, darkModeSwitcher = true }) => (
	<Main>
		{darkModeSwitcher && <DarkModeSwitcher />}
		<Container>{children}</Container>
	</Main>
);

export const withContainerLayout =
	(Component, darkModeSwitcher: boolean = true) =>
	// eslint-disable-next-line react/display-name
	(props) =>
		(
			<ContainerLayout darkModeSwitcher={darkModeSwitcher}>
				<Component {...props} />
			</ContainerLayout>
		);
