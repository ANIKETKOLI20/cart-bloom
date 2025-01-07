import { useEffect } from "react";

const CustomCursor = () => {
	useEffect(() => {
		const cursor = document.createElement("div");
		cursor.id = "custom-cursor";
		document.body.appendChild(cursor);

		const moveCursor = (e) => {
			cursor.style.left = `${e.clientX}px`;
			cursor.style.top = `${e.clientY}px`;
		};

		const addHoverEffect = () => cursor.classList.add("hover");
		const removeHoverEffect = () => cursor.classList.remove("hover");

		window.addEventListener("mousemove", moveCursor);
		document.querySelectorAll("button, input, a").forEach((el) => {
			el.addEventListener("mouseenter", addHoverEffect);
			el.addEventListener("mouseleave", removeHoverEffect);
		});

		return () => {
			window.removeEventListener("mousemove", moveCursor);
			document.body.removeChild(cursor);
		};
	}, []);

	return null;
};

export default CustomCursor;
