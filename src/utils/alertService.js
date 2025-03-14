import Swal from "sweetalert2";

const showDeniedAccessError = (message) => {
    Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: message
    });
}

export {
    showDeniedAccessError
}