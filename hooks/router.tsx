import { useRouter } from "next/router";
import { Url } from "url";

export const transitionCallbacks: Set<() => void> = new Set();

export const useRouterWithTransition = () => {
  const router = useRouter();
  const routerPush = router.push;

  router.push = (url: Url, as?: Url, options?: any) => {
    if (router.pathname !== String(url)) {
      transitionCallbacks.forEach((callback) => {
        callback();
      });
    }
    return routerPush(url, as, options);
  };

  return router;
};
