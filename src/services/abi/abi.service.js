export async function getABI(id) {
    const res = await fetch(`/abi/${id}.json`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => data);
    return res;
}
//# sourceMappingURL=abi.service.js.map