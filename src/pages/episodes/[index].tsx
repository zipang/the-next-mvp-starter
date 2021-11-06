import { Image } from "@chakra-ui/image";
import { AspectRatio, Stack } from "@chakra-ui/layout";
import { DocumentData } from "@firebase/firestore";
import { ErrorMessage } from "components/base/ErrorMessage";
import { LoadingSpinner } from "components/base/LoadingSpinner";
import CheckBoxes from "components/forms/inputs/CheckBoxes";
import { FormValidationProvider } from "components/forms/validation/FormValidationProvider";
import { loadDocument, updateDocument } from "lib/firebase/FirestoreClient";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { NextRouter, useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { useKeys } from "rooks";
import { withContainerLayout } from "src/layouts/ContainerLayout";

const _NEXT = 1;
const _PREVIOUS = -1;

const categories: any = [
	{ code: "parisian_women_itw", label: "Les Parisiennes" },
	{ code: "french_gastronomy", label: "Gastronomie" },
	{ code: "french_culture", label: "Culture française" },
	{ code: "shopping", label: "Achats" },
	{ code: "paris_visit", label: "Visite de Paris" },
	{ code: "french_region_visit", label: "Visite en province" },
	{ code: "tipa_music", label: "Tipa" },
	{ code: "camille", label: "L’univers de Camille" },
	{ code: "antoine", label: "Journal d’Antoine" },
	{ code: "practical_french", label: "Français pratique" }
];

/**
 * Navigate to a relative or absolute position
 * @param {NextRouter} router
 * @param {String} index Format : '0000'-'9999'
 * @param {Number} [delta=0] Add or remove delat positions to the current index
 */
const navigate =
	(router: NextRouter, index: string, delta = 0) =>
	(evt) => {
		evt.preventDefault();
		const nextEpisode = (10000 + Number.parseInt(index) + delta).toString().substr(1);
		router.push(`/episodes/${nextEpisode}`);
	};

const updateCategory = (index) => (data) => {
	updateDocument("episodes", index, data);
};
/**
 *
 * Retrieve the index of the episode to load from the page's path
 * @param {GetServerSidePropsContext} context
 * @returns
 */
export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => ({
	props: {
		index: context.params?.index
	}
});

/**
 * @typedef EpisodePageProps
 * @property {String} index Unique index of the episode (#0000-9999)
 */
/**
 * Display a single episode
 * @param {EpisodePageProps} props
 */
const EpisodePage = ({ index }) => {
	const [episode, setEpisode] = useState<DocumentData>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error>();
	const router = useRouter();

	const fixEpisode = (ep) => {
		if (ep.tags === 0) ep.tags = []; // Something wrong in the database
		setEpisode(ep);
	};

	useKeys(["PageUp"], navigate(router, index, -10));
	useKeys(["PageDown"], navigate(router, index, 10));
	useKeys(["Home"], navigate(router, "0001"));
	useKeys(["End"], navigate(router, "0333"));
	useKeys(["Control", "ArrowLeft"], navigate(router, index, _PREVIOUS));
	useKeys(["Control", "ArrowRight"], navigate(router, index, _NEXT));

	useEffect(() => {
		loadDocument("episodes", index)
			.then(fixEpisode)
			.catch(setError)
			.finally(() => setLoading(false));
	}, [index]);

	return loading ? (
		<LoadingSpinner message={`Loading episode #${index}...`} />
	) : error ? (
		<ErrorMessage error={error} />
	) : episode ? (
		<Stack>
			<p>
				Loaded Episode #{episode.slug} <strong>{episode.title}</strong>
			</p>

			<FormValidationProvider data={{ ...episode }}>
				<p>{episode.description}</p>
				<AspectRatio ratio={1 / 1}>
					<Image
						alt={episode.title}
						src={`https://www.tipafrance.com${episode.vignette}`}
					/>
				</AspectRatio>

				<CheckBoxes
					name="tags"
					label="Catégories"
					key={index}
					serialization="array"
					options={categories}
					defaultValue={episode.tags}
					onChange={updateCategory(index)}
				/>
			</FormValidationProvider>
		</Stack>
	) : (
		<p>Not found</p>
	);
};

export default withContainerLayout(EpisodePage);
