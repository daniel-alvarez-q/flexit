import type { MouseEventHandler, ReactEventHandler } from "react";

export type CardType = {
    id?: number;
    title?: string;
    subtitle?: string;
    body?: string;
    footer?: string;
    style?: string;
    uri?: string | null;
    onClick?:MouseEventHandler<HTMLDivElement> | undefined;
}