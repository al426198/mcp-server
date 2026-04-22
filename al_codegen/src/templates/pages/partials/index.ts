import { registerPageLayoutPartials } from "./layouts/index.js";
import { registerPageControlPartials } from "./controls/index.js";
import { registerPageActionPartials } from "./actions/index.js";

/**
 * Registra parciales de páginas en Handlebars.
 */
export const registerPagePartials = () => {
    registerPageActionPartials();
    registerPageLayoutPartials();
    registerPageControlPartials();
};