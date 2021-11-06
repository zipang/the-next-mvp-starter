import { Box, Link, SimpleGrid, Stack, Text } from "@chakra-ui/layout";
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

	// const fixEpisode = (ep, i) => {
	// 	const { _id, tags } = ep;
	// 	if (tags === 0) {
	// 		setTimeout(() => {
	// 			updateDocument("episodes", _id, { tags: [] });
	// 		}, i * 50);
	// 	}
	// 	return ep;
	// };

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
			<Text>Loaded {episodes.length} episodes</Text>
			{episodes.map((ep) => (
				<SimpleGrid key={ep.slug} templateColumns="1fr 3fr 1fr">
					<Box>{ep._id}</Box>
					<Box>
						<Link href={`/episodes/${ep._id}`}>
							{ep.title || `Episode ${ep._id}`}
						</Link>
					</Box>
					<Box>{ep.publicationDate.substr(0, 4)}</Box>
				</SimpleGrid>
			))}
		</Stack>
	);
};

export default withContainerLayout(EpisodePage);
