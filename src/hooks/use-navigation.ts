import { RouterNavigator } from "../router/router-navigator";
import { useBrouther } from "./use-brouther";

/*
    All methods to manipulate the history stack, an instance of RouterNavigator
    - go: go to N in the stack
    - back: go back in the stack
    - forward: go forward in the stack, if is possible
    - push: push the url to the stack and go to the path
    - replace: the same of push, but replace the current item in the stack
 */

export const useNavigation = (): RouterNavigator => useBrouther().navigation;
