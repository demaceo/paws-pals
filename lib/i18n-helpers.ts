import type { Messages } from "./i18n-messages";

export function translateAttribute(value: string, messages: Messages): string {
    const lowerValue = value.toLowerCase();

    // Sex translations
    if (lowerValue === "male") return messages["attr.male"] || value;
    if (lowerValue === "female") return messages["attr.female"] || value;

    // Size translations
    if (lowerValue === "small") return messages["attr.small"] || value;
    if (lowerValue === "medium") return messages["attr.medium"] || value;
    if (lowerValue === "large") return messages["attr.large"] || value;

    return value;
}

export function translateAge(age: string, messages: Messages): string {
    // Parse age like "2 years", "8 months", "1 year", etc.
    const match = age.match(/^(\d+)\s+(year|years|month|months)$/i);
    if (!match) return age;

    const count = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    if (unit.startsWith("year")) {
        const key = count === 1 ? "attr.year" : "attr.years";
        const template = messages[key];
        if (!template) return age;
        return template.replace("{count}", String(count));
    }

    if (unit.startsWith("month")) {
        const key = count === 1 ? "attr.month" : "attr.months";
        const template = messages[key];
        if (!template) return age;
        return template.replace("{count}", String(count));
    }

    return age;
}
