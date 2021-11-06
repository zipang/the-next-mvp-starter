import { Checkbox, CheckboxGroup } from "@chakra-ui/checkbox";
import { Image } from "@chakra-ui/image";
import { AspectRatio, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/layout";
import { StringOrNumber } from "@chakra-ui/utils";
import { DocumentData } from "@firebase/firestore";
import { ErrorMessage } from "components/base/ErrorMessage";
import { LoadingSpinner } from "components/base/LoadingSpinner";
import { SwipeContainer } from "components/base/SwipeContainer";
import { loadDocument, updateDocument } from "lib/firebase/FirestoreClient";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { NextRouter, useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
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

const ChooseCategories = ({
	name,
	label = "Categories",
	options = [],
	selected = [],
	onChange
}) => {
	const [values, setValues] = useState<StringOrNumber[]>([]);

	useEffect(() => {
		setValues(selected);
	}, [selected]);

	return (
		<CheckboxGroup
			value={values}
			onChange={(values) => {
				const patch = {};
				patch[name] = values;
				onChange(patch);
				setValues(values);
			}}
		>
			{label}
			<SimpleGrid columns={3}>
				{options.map(({ code, label }) => (
					<Checkbox
						name={`${name}:${code}`}
						key={`${name}:${code}`}
						value={code}
					>
						{label}
					</Checkbox>
				))}
			</SimpleGrid>
		</CheckboxGroup>
	);
};

/**
 * Navigate to a relative or absolute position
 * @param {NextRouter} router
 * @param {String} index Format : '0000'-'9999'
 * @param {Number} [delta=0] Add or remove delat positions to the current index
 */
const navigate =
	(router: NextRouter, index: string, delta = 0) =>
	(evt) => {
		if (evt && evt.preventDefault) evt.preventDefault();
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

	useKeys(["PageUp"], navigate(router, index, -10));
	useKeys(["PageDown"], navigate(router, index, 10));
	useKeys(["Home"], navigate(router, "0001"));
	useKeys(["End"], navigate(router, "0333"));
	useKeys(["Control", "ArrowLeft"], navigate(router, index, _PREVIOUS));
	useKeys(["Control", "ArrowRight"], navigate(router, index, _NEXT));

	useEffect(() => {
		console.log(`Loading episode ${index}`);
		loadDocument("episodes", index)
			.then(setEpisode)
			.catch(setError)
			.finally(() => setLoading(false));
	}, [index]);

	return loading ? (
		<LoadingSpinner message={`Loading episode #${index}...`} />
	) : error ? (
		<ErrorMessage error={error} />
	) : episode ? (
		<SwipeContainer
			onSwipedLeft={navigate(router, index, _NEXT)}
			onSwipedRight={navigate(router, index, _PREVIOUS)}
		>
			<Stack
				bg="whiteAlpha.100"
				mt={6}
				p={4}
				boxShadow="md"
				borderRadius="md"
				border="1px solid #bbb"
			>
				<Text>
					<code>#{episode.slug}</code>
				</Text>
				<Heading>{episode.title}</Heading>

				<Text>{episode.description}</Text>
				<AspectRatio ratio={4 / 3} bg="black">
					<Image
						alt={episode.title}
						m="0 auto"
						src={`https://www.tipafrance.com${episode.vignette}`}
					/>
				</AspectRatio>

				<ChooseCategories
					name="tags"
					label="Catégories"
					options={categories}
					selected={episode.tags}
					onChange={updateCategory(index)}
				/>
			</Stack>
		</SwipeContainer>
	) : (
		<p>Not found</p>
	);
};

export default withContainerLayout(EpisodePage);
