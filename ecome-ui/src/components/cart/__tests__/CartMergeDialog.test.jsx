import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import CartMergeDialog from "../CartMergeDialog";

// Mock H3
vi.mock("@typography", () => ({
    H3: ({ children }) => <h3>{children}</h3>,
}));

// Mock CartPreview
vi.mock("../CartPreview", () => ({
    default: ({ title, items, total }) => (
        <div data-testid={`preview-${title}`}>
            <div>{title}</div>
            <div>items:{items.length}</div>
            <div>total:{total}</div>
        </div>
    ),
}));

describe("CartMergeDialog", () => {
    const oldCart = [
        { id: "a", unitPrice: 100, quantity: 2 }, // total 200
        { id: "b", unitPrice: 50, quantity: 1 }, // total 50
    ];

    const latestCart = [
        { id: "x", unitPrice: 20, quantity: 3 }, // total 60
    ];

    test("renders both cart previews with correct totals", () => {
        render(<CartMergeDialog oldCart={oldCart} latestCart={latestCart} onChoose={() => {}} />);

        // Old cart preview
        expect(screen.getByTestId("preview-Old cart")).toHaveTextContent("items:2");
        expect(screen.getByTestId("preview-Old cart")).toHaveTextContent("total:250");

        // Latest cart preview
        expect(screen.getByTestId("preview-Latest cart")).toHaveTextContent("items:1");
        expect(screen.getByTestId("preview-Latest cart")).toHaveTextContent("total:60");
    });

    test("calls onChoose('old') when clicking Use old cart", () => {
        const onChoose = vi.fn();

        render(<CartMergeDialog oldCart={oldCart} latestCart={latestCart} onChoose={onChoose} />);

        fireEvent.click(screen.getByText("Use old cart"));
        expect(onChoose).toHaveBeenCalledWith("old");
    });

    test("calls onChoose('latest') when clicking Use latest cart", () => {
        const onChoose = vi.fn();

        render(<CartMergeDialog oldCart={oldCart} latestCart={latestCart} onChoose={onChoose} />);

        fireEvent.click(screen.getByText("Use latest cart"));
        expect(onChoose).toHaveBeenCalledWith("latest");
    });

    test("calls onChoose('merge') when clicking Merge both", () => {
        const onChoose = vi.fn();

        render(<CartMergeDialog oldCart={oldCart} latestCart={latestCart} onChoose={onChoose} />);

        fireEvent.click(screen.getByText("Merge both"));
        expect(onChoose).toHaveBeenCalledWith("merge");
    });
});
