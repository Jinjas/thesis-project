/**
 * Assinatura Limpa Gerada Automaticamente para: react.d.ts
 */

type NativeAnimationEvent = AnimationEvent;
type NativeClipboardEvent = ClipboardEvent;
type NativeCompositionEvent = CompositionEvent;
type NativeDragEvent = DragEvent;
type NativeFocusEvent = FocusEvent;
type NativeInputEvent = InputEvent;
type NativeKeyboardEvent = KeyboardEvent;
type NativeMouseEvent = MouseEvent;
type NativeTouchEvent = TouchEvent;
type NativePointerEvent = PointerEvent;
type NativeSubmitEvent = SubmitEvent;
type NativeToggleEvent = ToggleEvent;
type NativeTransitionEvent = TransitionEvent;
type NativeUIEvent = UIEvent;
type NativeWheelEvent = WheelEvent;
type Booleanish = boolean | "true" | "false";
type CrossOrigin = "anonymous" | "use-credentials" | "" | undefined;
const UNDEFINED_VOID_ONLY: unique symbol;
type AwaitedReactNode =
  | React.ReactElement
  | string
  | number
  | bigint
  | Iterable<React.ReactNode>
  | React.ReactPortal
  | boolean
  | null
  | undefined
  | React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES[keyof React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES];
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
type VoidOrUndefinedOnly = void | { [UNDEFINED_VOID_ONLY]: never };
declare namespace React {
    type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
    type JSXElementConstructor<P> =
        | ((props: P) => ReactNode | Promise<ReactNode>)
        | (new (props: P, context: any) => Component<any, any>);
    interface RefObject<T> {
        current: T;
      }
    interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES {}
    type RefCallback<T> = {
        bivarianceHack(
          instance: T | null,
        ):
          | void
          | (() => VoidOrUndefinedOnly)
          | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES];
      }["bivarianceHack"];
    type Ref<T> = RefCallback<T> | RefObject<T | null> | null;
    type LegacyRef<T> = Ref<T>;
    type ComponentState = any;
    interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_KEY_TYPES {}
    type Key =
        | string
        | number
        | bigint
        | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_KEY_TYPES[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_KEY_TYPES];
    interface Attributes {
        key?: Key | null | undefined;
      }
    interface RefAttributes<T> extends Attributes {
        ref?: Ref<T> | undefined;
      }
    interface ClassAttributes<T> extends RefAttributes<T> {}
    interface ReactElement<
        P = unknown,
        T extends string | JSXElementConstructor<any> =
          | string
          | JSXElementConstructor<any>,
      > {
        type: T;
        props: P;
        key: string | null;
      }
    interface FunctionComponentElement<P> extends ReactElement<
        P,
        FunctionComponent<P>
      > {
        ref?:
          | ("ref" extends keyof P
              ? P extends { ref?: infer R | undefined }
                ? R
                : never
              : never)
          | undefined;
      }
    type CElement<P, T extends Component<P, ComponentState>> = ComponentElement<
        P,
        T
      >;
    interface ComponentElement<
        P,
        T extends Component<P, ComponentState>,
      > extends ReactElement<P, ComponentClass<P>> {
        ref?: Ref<T> | undefined;
      }
    type ClassicElement<P> = CElement<P, ClassicComponent<P, ComponentState>>;
    interface ReactPortal extends ReactElement {
        children: ReactNode;
      }
    interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES {}
    type ReactNode =
        | ReactElement
        | string
        | number
        | bigint
        | Iterable<ReactNode>
        | ReactPortal
        | boolean
        | null
        | undefined
        | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES]
        | Promise<AwaitedReactNode>;
    function createElement<P extends {}>(
        type: FunctionComponent<P>,
        props?: (Attributes & P) | null,
        ...children: ReactNode[]
      ): FunctionComponentElement<P>;
    function createElement<
        P extends {},
        T extends Component<P, ComponentState>,
        C extends ComponentClass<P>,
      >(
        type: ClassType<P, T, C>,
        props?: (ClassAttributes<T> & P) | null,
        ...children: ReactNode[]
      ): CElement<P, T>;
    function createElement<P extends {}>(
        type: FunctionComponent<P> | ComponentClass<P> | string,
        props?: (Attributes & P) | null,
        ...children: ReactNode[]
      ): ReactElement<P>;
    function cloneElement<P>(
        element: FunctionComponentElement<P>,
        props?: Partial<P> & Attributes,
        ...children: ReactNode[]
      ): FunctionComponentElement<P>;
    function cloneElement<P, T extends Component<P, ComponentState>>(
        element: CElement<P, T>,
        props?: Partial<P> & ClassAttributes<T>,
        ...children: ReactNode[]
      ): CElement<P, T>;
    function cloneElement<P>(
        element: ReactElement<P>,
        props?: Partial<P> & Attributes,
        ...children: ReactNode[]
      ): ReactElement<P>;
    interface ProviderProps<T> {
        value: T;
        children?: ReactNode | undefined;
      }
    interface ConsumerProps<T> {
        children: (value: T) => ReactNode;
      }
    interface ExoticComponent<P = {}> {
        (props: P): ReactNode;
        readonly $$typeof: symbol;
      }
    interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
        displayName?: string | undefined;
      }
    interface ProviderExoticComponent<P> extends ExoticComponent<P> {}
    type ContextType<C extends Context<any>> =
        C extends Context<infer T> ? T : never;
    type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;
    type Consumer<T> = ExoticComponent<ConsumerProps<T>>;
    interface Context<T> extends Provider<T> {
        Provider: Provider<T>;
        Consumer: Consumer<T>;
        displayName?: string | undefined;
      }
    function createContext<T>(
        defaultValue: T,
      ): Context<T>;
    function isValidElement<P>(
        object: {} | null | undefined,
      ): object is ReactElement<P>;
    const Children: {
        map<T, C>(
          children: C | readonly C[],
          fn: (child: C, index: number) => T,
        ): C extends null | undefined
          ? C
          : Array<Exclude<T, boolean | null | undefined>>;
        forEach<C>(
          children: C | readonly C[],
          fn: (child: C, index: number) => void,
        ): void;
        count(children: any): number;
        only<C>(children: C): C extends any[] ? never : C;
        toArray(
          children: ReactNode | ReactNode[],
        ): Array<Exclude<ReactNode, boolean | null | undefined>>;
      };
    interface FragmentProps {
        children?: React.ReactNode;
      }
    const Fragment: ExoticComponent<FragmentProps>;
    const StrictMode: ExoticComponent<{ children?: ReactNode | undefined }>;
    interface SuspenseProps {
        children?: ReactNode | undefined;
        fallback?: ReactNode;
        name?: string | undefined;
      }
    const Suspense: ExoticComponent<SuspenseProps>;
    const version: string;
    type ProfilerOnRenderCallback = (
        id: string,
        phase: "mount" | "update" | "nested-update",
        actualDuration: number,
        baseDuration: number,
        startTime: number,
        commitTime: number,
      ) => void;
    interface ProfilerProps {
        children?: ReactNode | undefined;
        id: string;
        onRender: ProfilerOnRenderCallback;
      }
    const Profiler: ExoticComponent<ProfilerProps>;
    type ReactInstance = Component<any> | Element;
    interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<
        P,
        S,
        SS
      > {}
    class Component<P, S> {
        static contextType?: Context<any> | undefined;
        static propTypes?: any;
        context: unknown;
        constructor(props: P);
        constructor(props: P, context: any);
        setState<K extends keyof S>(
          state:
            | ((
                prevState: Readonly<S>,
                props: Readonly<P>,
              ) => Pick<S, K> | S | null)
            | (Pick<S, K> | S | null),
          callback?: () => void,
        ): void;
        forceUpdate(callback?: () => void): void;
        render(): ReactNode;
        readonly props: Readonly<P>;
        state: Readonly<S>;
      }
    class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {}
    interface ClassicComponent<P = {}, S = {}> extends Component<P, S> {
        replaceState(nextState: S, callback?: () => void): void;
        isMounted(): boolean;
        getInitialState?(): S;
      }
    type FC<P = {}> = FunctionComponent<P>;
    interface FunctionComponent<P = {}> {
        (props: P): ReactNode | Promise<ReactNode>;
        propTypes?: any;
        displayName?: string | undefined;
      }
    type ForwardedRef<T> =
        | ((instance: T | null) => void)
        | RefObject<T | null>
        | null;
    interface ForwardRefRenderFunction<T, P = {}> {
        (props: P, ref: ForwardedRef<T>): ReactNode;
        displayName?: string | undefined;
        propTypes?: any;
      }
    interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<
        P,
        S
      > {
        new (
          props: P,
          context?: any,
        ): Component<P, S>;
        propTypes?: any;
        contextType?: Context<any> | undefined;
        defaultProps?: Partial<P> | undefined;
        displayName?: string | undefined;
      }
    interface ClassicComponentClass<P = {}> extends ComponentClass<P> {
        new (props: P): ClassicComponent<P, ComponentState>;
        getDefaultProps?(): P;
      }
    type ClassType<
        P,
        T extends Component<P, ComponentState>,
        C extends ComponentClass<P>,
      > = C & (new (props: P, context: any) => T);
    interface ComponentLifecycle<P, S, SS = any>
        extends NewLifecycle<P, S, SS>, DeprecatedLifecycle<P, S> {
        componentDidMount?(): void;
        shouldComponentUpdate?(
          nextProps: Readonly<P>,
          nextState: Readonly<S>,
          nextContext: any,
        ): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
      }
    interface StaticLifecycle<P, S> {
        getDerivedStateFromProps?: GetDerivedStateFromProps<P, S> | undefined;
        getDerivedStateFromError?: GetDerivedStateFromError<P, S> | undefined;
      }
    type GetDerivedStateFromProps<P, S> =
        (nextProps: Readonly<P>, prevState: S) => Partial<S> | null;
    type GetDerivedStateFromError<P, S> =
        (error: any) => Partial<S> | null;
    interface NewLifecycle<P, S, SS> {
        getSnapshotBeforeUpdate?(
          prevProps: Readonly<P>,
          prevState: Readonly<S>,
        ): SS | null;
        componentDidUpdate?(
          prevProps: Readonly<P>,
          prevState: Readonly<S>,
          snapshot?: SS,
        ): void;
      }
    interface DeprecatedLifecycle<P, S> {
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(
          nextProps: Readonly<P>,
          nextContext: any,
        ): void;
        componentWillUpdate?(
          nextProps: Readonly<P>,
          nextState: Readonly<S>,
          nextContext: any,
        ): void;
        UNSAFE_componentWillUpdate?(
          nextProps: Readonly<P>,
          nextState: Readonly<S>,
          nextContext: any,
        ): void;
      }
    function createRef<T>(): RefObject<T | null>;
    interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
        propTypes?: any;
      }
    function forwardRef<T, P = {}>(
        render: ForwardRefRenderFunction<T, PropsWithoutRef<P>>,
      ): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
    type PropsWithoutRef<Props> =
        Props extends any
          ? "ref" extends keyof Props
            ? Omit<Props, "ref">
            : Props
          : Props;
    type PropsWithRef<Props> = Props;
    type PropsWithChildren<P = unknown> = P & {
        children?: ReactNode | undefined;
      };
    type ComponentPropsWithRef<T extends ElementType> =
        T extends JSXElementConstructor<infer Props>
          ? 
            T extends abstract new (args: any) => any
            ? PropsWithoutRef<Props> & RefAttributes<InstanceType<T>>
            : Props
          : ComponentProps<T>;
    type CustomComponentPropsWithRef<T extends ComponentType> =
        T extends JSXElementConstructor<infer Props>
          ? 
            T extends abstract new (args: any) => any
            ? PropsWithoutRef<Props> & RefAttributes<InstanceType<T>>
            : Props
          : never;
    type ComponentPropsWithoutRef<T extends ElementType> = PropsWithoutRef<
        ComponentProps<T>
      >;
    type ComponentRef<T extends ElementType> =
        ComponentPropsWithRef<T> extends RefAttributes<infer Method>
          ? Method
          : never;
    type MemoExoticComponent<T extends ComponentType<any>> = NamedExoticComponent<
        CustomComponentPropsWithRef<T>
      > & {
        readonly type: T;
      };
    function memo<P extends object>(
        Component: FunctionComponent<P>,
        propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean,
      ): NamedExoticComponent<P>;
    function memo<T extends ComponentType<any>>(
        Component: T,
        propsAreEqual?: (
          prevProps: Readonly<ComponentProps<T>>,
          nextProps: Readonly<ComponentProps<T>>,
        ) => boolean,
      ): MemoExoticComponent<T>;
    interface LazyExoticComponent<
        T extends ComponentType<any>,
      > extends ExoticComponent<CustomComponentPropsWithRef<T>> {
        readonly _result: T;
      }
    function lazy<T extends ComponentType<any>>(
        load: () => Promise<{ default: T }>,
      ): LazyExoticComponent<T>;
    type SetStateAction<S> = S | ((prevState: S) => S);
    type Dispatch<A> = (value: A) => void;
    type DispatchWithoutAction = () => void;
    type AnyActionArg = [] | [any];
    type ActionDispatch<ActionArg extends AnyActionArg> = (
        ...args: ActionArg
      ) => void;
    type Reducer<S, A> = (prevState: S, action: A) => S;
    type ReducerWithoutAction<S> = (prevState: S) => S;
    type ReducerState<R extends Reducer<any, any>> =
        R extends Reducer<infer S, any> ? S : never;
    type DependencyList = readonly unknown[];
    type EffectCallback = () => void | Destructor;
    interface MutableRefObject<T> {
        current: T;
      }
    function useContext<T>(
        context: Context<T> ,
      ): T;
    function useState<S>(
        initialState: S | (() => S),
      ): [S, Dispatch<SetStateAction<S>>];
    function useState<S = undefined>(): [
        S | undefined,
        Dispatch<SetStateAction<S | undefined>>,
      ];
    function useReducer<S, A extends AnyActionArg>(
        reducer: (prevState: S, ...args: A) => S,
        initialState: S,
      ): [S, ActionDispatch<A>];
    function useReducer<S, I, A extends AnyActionArg>(
        reducer: (prevState: S, ...args: A) => S,
        initialArg: I,
        init: (i: I) => S,
      ): [S, ActionDispatch<A>];
    function useRef<T>(initialValue: T): RefObject<T>;
    function useRef<T>(initialValue: T | null): RefObject<T | null>;
    function useRef<T>(initialValue: T | undefined): RefObject<T | undefined>;
    function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
    function useEffect(effect: EffectCallback, deps?: DependencyList): void;
    function useEffectEvent<T extends Function>(callback: T): T;
    function useImperativeHandle<T, R extends T>(
        ref: Ref<T> | undefined,
        init: () => R,
        deps?: DependencyList,
      ): void;
    function useCallback<T extends Function>(
        callback: T,
        deps: DependencyList,
      ): T;
    function useMemo<T>(factory: () => T, deps: DependencyList): T;
    function useDebugValue<T>(value: T, format?: (value: T) => any): void;
    type TransitionFunction = () =>
        | VoidOrUndefinedOnly
        | Promise<VoidOrUndefinedOnly>;
    interface TransitionStartFunction {
        (callback: TransitionFunction): void;
      }
    function useDeferredValue<T>(value: T, initialValue?: T): T;
    function useTransition(): [boolean, TransitionStartFunction];
    function startTransition(scope: TransitionFunction): void;
    function act(callback: () => VoidOrUndefinedOnly): void;
    function act<T>(callback: () => T | Promise<T>): Promise<T>;
    function useId(): string;
    function useInsertionEffect(
        effect: EffectCallback,
        deps?: DependencyList,
      ): void;
    function useSyncExternalStore<Snapshot>(
        subscribe: (onStoreChange: () => void) => () => void,
        getSnapshot: () => Snapshot,
        getServerSnapshot?: () => Snapshot,
      ): Snapshot;
    function useOptimistic<State>(
        passthrough: State,
      ): [State, (action: State | ((pendingState: State) => State)) => void];
    function useOptimistic<State, Action>(
        passthrough: State,
        reducer: (state: State, action: Action) => State,
      ): [State, (action: Action) => void];
    interface UntrackedReactPromise<T> extends PromiseLike<T> {
        status?: void;
      }
    interface PendingReactPromise<T> extends PromiseLike<T> {
        status: "pending";
      }
    interface FulfilledReactPromise<T> extends PromiseLike<T> {
        status: "fulfilled";
        value: T;
      }
    interface RejectedReactPromise<T> extends PromiseLike<T> {
        status: "rejected";
        reason: unknown;
      }
    type ReactPromise<T> =
        | UntrackedReactPromise<T>
        | PendingReactPromise<T>
        | FulfilledReactPromise<T>
        | RejectedReactPromise<T>;
    type Usable<T> = ReactPromise<T> | Context<T>;
    function use<T>(usable: Usable<T>): T;
    function useActionState<State>(
        action: (state: Awaited<State>) => State | Promise<State>,
        initialState: Awaited<State>,
        permalink?: string,
      ): [state: Awaited<State>, dispatch: () => void, isPending: boolean];
    function useActionState<State, Payload>(
        action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
        initialState: Awaited<State>,
        permalink?: string,
      ): [
        state: Awaited<State>,
        dispatch: (payload: Payload) => void,
        isPending: boolean,
      ];
    function cache<CachedFunction extends Function>(
        fn: CachedFunction,
      ): CachedFunction;
    interface CacheSignal {}
    function cacheSignal(): null | CacheSignal;
    interface ActivityProps {
        mode?: "hidden" | "visible" | undefined;
        name?: string | undefined;
        children: ReactNode;
      }
    const Activity: ExoticComponent<ActivityProps>;
    function captureOwnerStack(): string | null;
    interface BaseSyntheticEvent<E = object, C = any, T = any> {
        nativeEvent: E;
        currentTarget: C;
        target: T;
        bubbles: boolean;
        cancelable: boolean;
        defaultPrevented: boolean;
        eventPhase: number;
        isTrusted: boolean;
        preventDefault(): void;
        isDefaultPrevented(): boolean;
        stopPropagation(): void;
        isPropagationStopped(): boolean;
        persist(): void;
        timeStamp: number;
        type: string;
      }
    interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<
        E,
        EventTarget & T,
        EventTarget
      > {}
    interface ClipboardEvent<T = Element> extends SyntheticEvent<
        T,
        NativeClipboardEvent
      > {
        clipboardData: DataTransfer;
      }
    interface CompositionEvent<T = Element> extends SyntheticEvent<
        T,
        NativeCompositionEvent
      > {
        data: string;
      }
    interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
        dataTransfer: DataTransfer;
      }
    interface PointerEvent<T = Element> extends MouseEvent<
        T,
        NativePointerEvent
      > {
        pointerId: number;
        pressure: number;
        tangentialPressure: number;
        tiltX: number;
        tiltY: number;
        twist: number;
        width: number;
        height: number;
        pointerType: "mouse" | "pen" | "touch";
        isPrimary: boolean;
      }
    interface FocusEvent<
        Target = Element,
        RelatedTarget = Element,
      > extends SyntheticEvent<Target, NativeFocusEvent> {
        relatedTarget: (EventTarget & RelatedTarget) | null;
        target: EventTarget & Target;
      }
    interface FormEvent<T = Element> extends SyntheticEvent<T> {}
    interface InvalidEvent<T = Element> extends SyntheticEvent<T> {}
    interface ChangeEvent<
        CurrentTarget = Element,
        Target = Element,
      > extends SyntheticEvent<CurrentTarget> {
        target: EventTarget & CurrentTarget;
      }
    interface InputEvent<T = Element> extends SyntheticEvent<
        T,
        NativeInputEvent
      > {
        data: string;
      }
    interface KeyboardEvent<T = Element> extends UIEvent<T, NativeKeyboardEvent> {
        altKey: boolean;
        charCode: number;
        ctrlKey: boolean;
        code: string;
        getModifierState(key: ModifierKey): boolean;
        key: string;
        keyCode: number;
        locale: string;
        location: number;
        metaKey: boolean;
        repeat: boolean;
        shiftKey: boolean;
        which: number;
      }
    interface MouseEvent<T = Element, E = NativeMouseEvent> extends UIEvent<
        T,
        E
      > {
        altKey: boolean;
        button: number;
        buttons: number;
        clientX: number;
        clientY: number;
        ctrlKey: boolean;
        getModifierState(key: ModifierKey): boolean;
        metaKey: boolean;
        movementX: number;
        movementY: number;
        pageX: number;
        pageY: number;
        relatedTarget: EventTarget | null;
        screenX: number;
        screenY: number;
        shiftKey: boolean;
      }
    interface SubmitEvent<T = Element> extends SyntheticEvent<
        T,
        NativeSubmitEvent
      > {
        target: EventTarget & HTMLFormElement;
      }
    interface TouchEvent<T = Element> extends UIEvent<T, NativeTouchEvent> {
        altKey: boolean;
        changedTouches: TouchList;
        ctrlKey: boolean;
        getModifierState(key: ModifierKey): boolean;
        metaKey: boolean;
        shiftKey: boolean;
        targetTouches: TouchList;
        touches: TouchList;
      }
    interface UIEvent<T = Element, E = NativeUIEvent> extends SyntheticEvent<
        T,
        E
      > {
        detail: number;
        view: AbstractView;
      }
    interface WheelEvent<T = Element> extends MouseEvent<T, NativeWheelEvent> {
        deltaMode: number;
        deltaX: number;
        deltaY: number;
        deltaZ: number;
      }
    interface AnimationEvent<T = Element> extends SyntheticEvent<
        T,
        NativeAnimationEvent
      > {
        animationName: string;
        elapsedTime: number;
        pseudoElement: string;
      }
    interface ToggleEvent<T = Element> extends SyntheticEvent<
        T,
        NativeToggleEvent
      > {
        oldState: "closed" | "open";
        newState: "closed" | "open";
      }
    interface TransitionEvent<T = Element> extends SyntheticEvent<
        T,
        NativeTransitionEvent
      > {
        elapsedTime: number;
        propertyName: string;
        pseudoElement: string;
      }
    type EventHandler<E extends SyntheticEvent<any>> = {
        bivarianceHack(event: E): void;
      }["bivarianceHack"];
    type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
    type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
    type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
    type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
    type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
    type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
    type ChangeEventHandler<
        CurrentTarget = Element,
        Target = Element,
      > = EventHandler<ChangeEvent<CurrentTarget, Target>>;
    type InputEventHandler<T = Element> = EventHandler<InputEvent<T>>;
    type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
    type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
    type SubmitEventHandler<T = Element> = EventHandler<SubmitEvent<T>>;
    type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
    type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
    type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
    type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
    type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
    type ToggleEventHandler<T = Element> = EventHandler<ToggleEvent<T>>;
    type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;
    interface SVGLineElementAttributes<T> extends SVGProps<T> {}
    interface SVGTextElementAttributes<T> extends SVGProps<T> {}
    interface CSSProperties extends CSS.Properties<string | number> {
      }
    interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS {}
    type HTMLAttributeReferrerPolicy =
        | ""
        | "no-referrer"
        | "no-referrer-when-downgrade"
        | "origin"
        | "origin-when-cross-origin"
        | "same-origin"
        | "strict-origin"
        | "strict-origin-when-cross-origin"
        | "unsafe-url";
    type HTMLAttributeAnchorTarget =
        | "_self"
        | "_blank"
        | "_parent"
        | "_top"
        | (string & {});
    interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_IMG_SRC_TYPES {}
    type AutoFillAddressKind = "billing" | "shipping";
    type AutoFillBase = "" | "off" | "on";
    type AutoFillContactField =
        | "email"
        | "tel"
        | "tel-area-code"
        | "tel-country-code"
        | "tel-extension"
        | "tel-local"
        | "tel-local-prefix"
        | "tel-local-suffix"
        | "tel-national";
    type AutoFillContactKind = "home" | "mobile" | "work";
    type AutoFillCredentialField = "webauthn";
    type OptionalPrefixToken<T extends string> = `${T} ` | "";
    type OptionalPostfixToken<T extends string> = ` ${T}` | "";
    type AutoFillField =
        | AutoFillNormalField
        | `${OptionalPrefixToken<AutoFillContactKind>}${AutoFillContactField}`;
    type AutoFillSection = `section-${string}`;
    type AutoFill =
        | AutoFillBase
        | `${OptionalPrefixToken<AutoFillSection>}${OptionalPrefixToken<AutoFillAddressKind>}${AutoFillField}${OptionalPostfixToken<AutoFillCredentialField>}`;
    type HTMLInputAutoCompleteAttribute = AutoFill | (string & {});
    interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_MEDIA_SRC_TYPES {}
    interface AbstractView {
        styleMedia: StyleMedia;
        document: Document;
      }
    interface Touch {
        identifier: number;
        target: EventTarget;
        screenX: number;
        screenY: number;
        clientX: number;
        clientY: number;
        pageX: number;
        pageY: number;
      }
    interface TouchList {
        [index: number]: Touch;
        length: number;
        item(index: number): Touch;
        identifiedTouch(identifier: number): Touch;
      }
    interface ErrorInfo {
        componentStack?: string | null;
      }
    type ElementType = string | React.JSXElementConstructor<any>;
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
          render(): React.ReactNode;
        }
    interface ElementAttributesProperty {
          props: {};
        }
    interface ElementChildrenAttribute {
          children: {};
        }
    type LibraryManagedAttributes<C, P> = C extends
          | React.MemoExoticComponent<infer T>
          | React.LazyExoticComponent<infer T>
          ? T extends
              | React.MemoExoticComponent<infer U>
              | React.LazyExoticComponent<infer U>
            ? ReactManagedAttributes<U, P>
            : ReactManagedAttributes<T, P>
          : ReactManagedAttributes<C, P>;
    interface IntrinsicAttributes extends React.Attributes {}
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
    type InexactPartial<T> = { [K in keyof T]?: T[K] | undefined };
    type Defaultize<P, D> = P extends any
      ? string extends keyof P
        ? P
        : Pick<P, Exclude<keyof P, keyof D>> &
            InexactPartial<Pick<P, Extract<keyof P, keyof D>>> &
            InexactPartial<Pick<D, Exclude<keyof D, keyof P>>>
      : never;
    type ReactManagedAttributes<C, P> = C extends { defaultProps: infer D }
      ? Defaultize<P, D>
      : P;
}