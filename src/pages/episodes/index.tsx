import { Box, Link, LinkBox, SimpleGrid, Stack } from "@chakra-ui/layout";
import { DocumentData } from "@firebase/firestore";
import { ErrorMessage } from "components/base/ErrorMessage";
import { LoadingSpinner } from "components/base/LoadingSpinner";
import { useEffect, useState } from "react";
import { withContainerLayout } from "src/layouts/ContainerLayout";
import { loadCollectionData } from "../../lib/firebase/FirestoreClient";

/**
 * Display the list of all available episodes
 */
const EpisodePage = () => {
	const [episodes, setEpisodes] = useState<Array<DocumentData>>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		loadCollectionData("episodes")
			.then(setEpisodes)
			.catch(setError)
			.finally(() => setLoading(false));
	}, []);

	return loading ? (
		<LoadingSpinner message="Loading collection..." />
	) : error ? (
		<ErrorMessage error={error} />
	) : (
		<Stack>
			<p>Loaded {episodes.length} episodes</p>
			{episodes.map((ep) => (
				<SimpleGrid key={ep.slug} templateColumns="1fr 3fr">
					<LinkBox>
						<Link href={`/episodes/${ep._id}`}>{ep.slug}</Link>
					</LinkBox>
					<Box>{ep.title}</Box>
				</SimpleGrid>
			))}
		</Stack>
	);
};

export default withContainerLayout(EpisodePage);
