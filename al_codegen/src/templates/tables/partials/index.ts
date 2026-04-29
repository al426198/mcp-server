import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { ROOT } from "../../../index.js";

/**
 * Registra parciales de tablas en Handlebars.
 */
export const registerTablePartials = () => {
    Handlebars.registerPartial(
        "table-field",
        fs.readFileSync(path.join(ROOT, "src/templates/tables/partials/field.hbs"), "utf-8")
    );
    Handlebars.registerPartial(
        "fieldgroup",
        fs.readFileSync(path.join(ROOT, "src/templates/tables/partials/fieldgroup.hbs"), "utf-8")
    );
    Handlebars.registerPartial(
        "key",
        fs.readFileSync(path.join(ROOT, "src/templates/tables/partials/key.hbs"), "utf-8")
    );
};