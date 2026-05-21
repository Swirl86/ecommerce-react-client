export function cartsAreIdentical(a, b) {
    if (a.length !== b.length) return false;

    const sortByProduct = (arr) => [...arr].sort((x, y) => x.productId - y.productId);

    const A = sortByProduct(a);
    const B = sortByProduct(b);

    for (let i = 0; i < A.length; i++) {
        if (A[i].productId !== B[i].productId || A[i].quantity !== B[i].quantity) {
            return false;
        }
    }

    return true;
}
