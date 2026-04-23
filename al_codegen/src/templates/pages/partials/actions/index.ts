import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { __root } from "../../../../index.js";

/**
 * Registra parciales de acciones de páginas en Handlebars.
 */
export const registerPageActionPartials = () => {
    Handlebars.registerPartial(
        "action",
        fs.readFileSync(path.join(__root, "src/templates/pages/partials/actions/action.hbs"), "utf-8")
    );
    Handlebars.registerPartial(
        "group",
        fs.readFileSync(path.join(__root, "src/templates/pages/partials/actions/action-cluster.hbs"), "utf-8")
    );
};