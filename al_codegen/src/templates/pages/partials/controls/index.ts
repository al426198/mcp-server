import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { ROOT } from "../../../../index.js";

/**
 * Registra parciales de controles de páginas en Handlebars.
 */
export const registerPageControlPartials = () => {
    Handlebars.registerPartial(
        "group",
        fs.readFileSync(path.join(ROOT, "src/templates/pages/partials/controls/group.hbs"), "utf-8")
    );
    Handlebars.registerPartial(
        "field",
        fs.readFileSync(path.join(ROOT, "src/templates/pages/partials/controls/page-field.hbs"), "utf-8")
    );
    Handlebars.registerPartial(
        "part",
        fs.readFileSync(path.join(ROOT, "src/templates/pages/partials/controls/part.hbs"), "utf-8")
    );
    Handlebars.registerPartial(
        "repeater",
        fs.readFileSync(path.join(ROOT, "src/templates/pages/partials/controls/repeater.hbs"), "utf-8")
    );
};