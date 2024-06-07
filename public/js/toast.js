async function triggerToast(message, toastType, toastBtnText, redirectionUrl, redirectedAt) {
    if (toastType === 'custom') {
        let result = await Swal.fire({
            text: message,
            showCancelButton: true,
            confirmButtonText: toastBtnText,
        });

        if (result.value) {
            let url = window.origin + redirectionUrl + '?redirectedAt=' + redirectedAt
            window.location.href = url;
        }
    } else {
            await Swal.fire({
                type: toastType,
                title: "Oops...",
                text: message,
            });
    }
}