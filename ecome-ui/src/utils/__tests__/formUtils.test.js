import { getChangedFields, isDirty } from "../formUtils";

describe("formUtils", () => {
    test("getChangedFields returns only changed fields", () => {
        const form = { name: "Anna", email: "new@example.com" };
        const original = { name: "Anna", email: "old@example.com" };

        expect(getChangedFields(form, original)).toEqual({
            email: "new@example.com",
        });
    });

    test("getChangedFields trims string values", () => {
        const form = { name: " Anna " };
        const original = { name: "Anna" };

        expect(getChangedFields(form, original)).toEqual({});
    });

    test("getChangedFields detects trimmed changes", () => {
        const form = { name: "Anna " };
        const original = { name: "Anna" };

        expect(getChangedFields(form, original)).toEqual({});
    });

    test("getChangedFields handles null original", () => {
        const form = { name: "Anna" };
        const original = null;

        expect(() => getChangedFields(form, original)).not.toThrow();
        expect(getChangedFields(form, original)).toEqual({ name: "Anna" });
    });

    test("isDirty handles null original", () => {
        const form = { name: "Anna" };
        const original = null;

        expect(isDirty(form, original)).toBe(true);
    });

    test("isDirty returns true when something changed", () => {
        const form = { name: "Anna" };
        const original = { name: "Bob" };

        expect(isDirty(form, original)).toBe(true);
    });

    test("isDirty returns false when nothing changed", () => {
        const form = { name: "Anna", email: "a@a.com" };
        const original = { name: "Anna", email: "a@a.com" };

        expect(isDirty(form, original)).toBe(false);
    });

    test("isDirty handles empty original values", () => {
        const form = { name: "Anna" };
        const original = {};

        expect(isDirty(form, original)).toBe(true);
    });
});
