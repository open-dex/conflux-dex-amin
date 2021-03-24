export async function signV4(typedData, fun) {
    console.log(`sign v4, data:`, typedData)
    let conflux = window.conflux
    window.confluxJS.provider.sendAsync(
        {
            method: 'cfx_signTypedData_v4',
            params: [conflux.selectedAddress, JSON.stringify(typedData)],
            from: conflux.selectedAddress,
        },
        (err, result) => {
            if (err) {
                console.log(`sign fail:`,err)
            } else {
                fun(result)
            }
        }
    )
}