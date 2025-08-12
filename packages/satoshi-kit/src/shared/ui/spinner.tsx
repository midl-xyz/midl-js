import { forwardRef } from "react";
import { styled } from "styled-system/jsx";
import {
	Spinner as StyledSpinner,
	type SpinnerProps as StyledSpinnerProps,
} from "./styled/spinner";

export interface SpinnerProps extends StyledSpinnerProps {
	/**
	 * For accessibility, it is important to add a fallback loading text.
	 * This text will be visible to screen readers.
	 * @default "Loading..."
	 */
	label?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
	(props, ref) => {
		const { label = "Loading...", ...rest } = props;

		return (
			<div ref={ref}>
				<StyledSpinner {...rest} />
				{label && <styled.span srOnly>{label}</styled.span>}
			</div>
		);
	},
);

Spinner.displayName = "Spinner";
