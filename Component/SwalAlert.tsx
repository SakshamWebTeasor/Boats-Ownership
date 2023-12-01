import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const showSwal = (
  errorTitle: string,
  errorMessage: string,
  status: number,
  route: string | undefined,
  router: any
) => {
  withReactContent(Swal).fire({
    icon: (status>=200 && status<300) ? "success" : "error",
    title: errorTitle,
    text: errorMessage,
  });
  if (route == undefined) {
    // router.push("/");
  } else {
    setTimeout(() => {
      router.push(route);
    }, 1000);
  }
};
