import { useSwipeable } from "react-swipeable";
import { SwipeableCallbacks } from "react-swipeable/dist/types";

/**
 * @typedef {Object} SwipeContainerProps
 * @property {JSX.Element} children
 * @property {Function} [onSwipedLeft] Callback when user has swiped left
 * @property {Function} [onSwipedRight] Callback when user has swiped right
 * @property {Function} [onSwipedUp] Callback when user has swiped up
 * @property {Function} [onSwipedDown] Callback when user has swiped down
 */
type SwipeContainerProps = Partial<
	{
		children: JSX.Element;
	} & SwipeableCallbacks
>;

/**
 * @param {SwipeContainerProps} props
 */
export const SwipeContainer = ({
	children,
	...swipeEventHandlers
}: SwipeContainerProps): JSX.Element => {
	const handlers = useSwipeable({
		...swipeEventHandlers,
		preventDefaultTouchmoveEvent: true,
		trackMouse: true
	});

	return (
		<div className="swipe-container" {...handlers}>
			{children}
		</div>
	);
};
