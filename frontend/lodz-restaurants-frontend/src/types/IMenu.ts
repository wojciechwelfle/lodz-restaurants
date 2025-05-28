import type IDish from "./IDish.ts";

export default interface IMenu {
    menuId: number;
    menuName: string;
    menuDescription?: string;
    dishes: IDish[];
}