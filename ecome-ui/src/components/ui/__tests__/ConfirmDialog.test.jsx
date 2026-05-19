import { fireEvent, render, screen } from "@testing-library/react";
import ConfirmDialog from "@ui/ConfirmDialog";
import { vi } from "vitest";

// Mock createPortal → renders directly instead of in document.body
vi.mock("react-dom", () => ({
    createPortal: (node) => node,
}));

describe("ConfirmDialog", () => {
    const setup = (props = {}) => {
        const defaultProps = {
            open: true,
            title: "Clear wishlist",
            message: "Are you sure?",
            onConfirm: vi.fn(),
            onCancel: vi.fn(),
        };

        return {
            ...defaultProps,
            ...props,
            ...render(<ConfirmDialog {...defaultProps} {...props} />),
        };
    };

    test("does not render when open = false", () => {
        render(<ConfirmDialog open={false} />);

        expect(screen.queryByText("Clear wishlist")).not.toBeInTheDocument();
        expect(screen.queryByText("Delete all")).not.toBeInTheDocument();
    });

    test("renders dialog when open = true", () => {
        setup();

        expect(screen.getByText("Clear wishlist")).toBeInTheDocument();
        expect(screen.getByText("Are you sure?")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
        expect(screen.getByText("Delete all")).toBeInTheDocument();
    });

    test("calls onCancel when clicking backdrop", () => {
        const { onCancel, container } = setup();

        // The backdrop is the FIRST child inside the portal wrapper
        const wrapper = container.querySelector(".fixed.inset-0");
        const backdrop = wrapper.firstElementChild;

        fireEvent.click(backdrop);

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test("calls onCancel when clicking Cancel button", () => {
        const { onCancel } = setup();

        fireEvent.click(screen.getByText("Cancel"));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test("calls onConfirm when clicking Delete all", () => {
        const { onConfirm } = setup();

        fireEvent.click(screen.getByText("Delete all"));

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });
});
