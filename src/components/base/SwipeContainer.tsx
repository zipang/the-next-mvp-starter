import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

/**
 * @typedef {Object} SwipeContainerProps
 * @property {JSX.Element} children
 * @property {Function} [onSwipedLeft] Callback when user has swiped left
 * @property {Function} [onSwipedRight] Callback when user has swiped right
 * @property {Function} [onSwipedUp] Callback when user has swiped up
 * @property {Function} [onSwipedDown] Callback when user has swiped down
 */
type SwipeContainerProps = Partial<{
	children: JSX.Element;
	onSwipedLeft: Function;
	onSwipedRight: Function;
	onSwipedUp: Function;
	onSwipedDown: Function;
}>;

/**
 * @param {SwipeContainerProps} props
 */
export const SwipeContainer = ({
	children,
	onSwipedLeft,
	onSwipedRight,
	onSwipedDown,
	onSwipedUp
}: SwipeContainerProps): JSX.Element => {
	const cardElem = useRef(null);
	const x = useMotionValue(0);
	const input = [-400, 0, 400];
	// const outputOpacity = [0, 1, 0];
	const outputRotateY = [-90, 0, 90];
	// const opacity = useTransform(x, input, outputOpacity);
	const rotateY = useTransform(x, input, outputRotateY);
	const [direction, setDirection] = useState<string | null>(null);

	const determineDirection = () => {
		if (x.getPrevious() < x.get()) {
			setDirection("right");
		} else {
			setDirection("left");
		}
	};

	const onDragEnd = () => {
		if (direction === "left" && onSwipedLeft) {
			onSwipedLeft();
		} else if (direction === "right" && onSwipedRight) {
			onSwipedRight();
		} else if (direction === "up" && onSwipedUp) {
			onSwipedUp();
		} else if (direction === "down" && onSwipedDown) {
			onSwipedDown();
		}
		x.updateAndNotify(0, true);
	};

	return (
		<motion.div
			drag="x"
			dragDirectionLock={true}
			className="swipe-container"
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={1}
			ref={cardElem}
			style={{ x, rotateY }}
			onDrag={determineDirection}
			onDragEnd={onDragEnd}
			whileTap={{ cursor: "grabbing" }}
		>
			{children}
		</motion.div>
	);
};
