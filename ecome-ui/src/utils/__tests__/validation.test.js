import { validateEmail, validatePassword } from "../validation";

describe("validation utils", () => {
    // -----------------------------
    // EMAIL TESTS
    // -----------------------------
    test("empty email", () => {
        expect(validateEmail("")).toBe("Email is required");
    });

    test("too short email", () => {
        expect(validateEmail("a")).toBe("Email must be at least 2 characters");
    });

    test("too long email", () => {
        const longEmail = "a".repeat(51) + "@test.com";
        expect(validateEmail(longEmail)).toBe("Email must be less than 50 characters");
    });

    test("missing @", () => {
        expect(validateEmail("testexample.com")).toBe("Invalid email format");
    });

    test("invalid domain", () => {
        expect(validateEmail("test@domain")).toBe("Invalid email format");
    });

    test("valid email", () => {
        expect(validateEmail("test@example.com")).toBe("");
    });

    // -----------------------------
    // PASSWORD TESTS
    // -----------------------------
    test("empty password", () => {
        expect(validatePassword("")).toBe("Password is required");
    });

    test("short password", () => {
        expect(validatePassword("123")).toBe("Password must be at least 8 characters");
    });

    test("valid password", () => {
        expect(validatePassword("password123")).toBe("");
    });
});
