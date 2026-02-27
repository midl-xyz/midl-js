import { styled } from "styled-system/jsx";
import { spinner } from "styled-system/recipes";
import type { ComponentProps } from "styled-system/types";
import { SpinnerIcon } from "~/shared/ui/spinner-icon";

export type SpinnerProps = ComponentProps<typeof Spinner>;
export const Spinner = styled(SpinnerIcon, spinner);
