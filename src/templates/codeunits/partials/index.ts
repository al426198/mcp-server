import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { ROOT } from "../../../index.js";

/**
 * Registra parciales de codeunits en Handlebars.
 */
export const registerCodeunitPartials = () => {
    Handlebars.registerPartial(
        "procedure",
        fs.readFileSync(path.join(ROOT, "src/templates/codeunits/partials/procedure.hbs"), "utf-8")
    );
};
