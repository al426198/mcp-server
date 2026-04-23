import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { __root } from "../../../../index.js";

/**
 * Registra parciales de layouts de páginas en Handlebars.
 * El nombre del parcial debe coincidir con el PageType para evitar el uso de un "switch".
 */
export const registerPageLayoutPartials = () => {
    Handlebars.registerPartial(
        "API",
        fs.readFileSync(path.join(__root, "src/templates/pages/partials/layouts/api-layout.hbs"), "utf-8")
    );
    Handlebars.registerPartial(
        "Card",
        fs.readFileSync(path.join(__root, "src/templates/pages/partials/layouts/card-layout.hbs"), "utf-8")
    );
    Handlebars.registerPartial(
        "List",
        fs.readFileSync(path.join(__root, "src/templates/pages/partials/layouts/list-layout.hbs"), "utf-8")
    );
};