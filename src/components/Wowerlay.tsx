import {
  Teleport,
  Transition,
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toRef,
  watch,
} from 'vue';
import { useFloating, flip, shift, offset, autoUpdate, Middleware } from '@floating-ui/vue';
import { cWowerlayAnimEnter, cWowerlayAnimLeave, cWowerlayBackground, cWowerlay } from '../consts';

import { Props } from './Wowerlay.constants';
import { isElement } from '../utils';

const ATTR_PREFIX = 'data-wowerlay-';
const SCOPE_ATTR_QUERY = `[${ATTR_PREFIX}scope]`;
const STOP_ATTR_QUERY = `[${ATTR_PREFIX}stop]`;

const syncSize: Middleware = {
  name: 'wowerlay:syncBounds',
  fn({ placement, elements }) {
    const target = elements.reference as HTMLElement;
    const popover = elements.floating as HTMLElement;

    if (placement.startsWith('left') || placement.startsWith('right')) {
      popover.style.setProperty('height', `${target.offsetHeight}px`);
    } else if (placement.startsWith('top') || placement.startsWith('bottom')) {
      popover.style.setProperty('width', `${target.offsetWidth}px`);
    }

    return {};
  },
};

const attrs: Middleware = {
  name: 'wowerlay:attr',
  fn({ placement, elements, x, y, rects }) {
    elements.floating.setAttribute('data-popover-placement', placement);
    elements.floating.setAttribute('data-popover-x', x.toString());
    elements.floating.setAttribute('data-popover-y', y.toString());
    elements.floating.setAttribute('data-popover-rect', JSON.stringify(rects.floating));

    return {};
  },
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOOP = () => {};

export const Wowerlay = defineComponent({
  name: 'Wowerlay',
  inheritAttrs: false,
  props: Props,
  emits: {
    'update:visible': null! as (value: boolean) => void,
    'update:el': null! as (value: HTMLElement | null) => void,
  },
  setup(props, { emit }) {
    const popoverEl = shallowRef<HTMLDivElement | null>(null);
    const backgroundEl = shallowRef<HTMLElement | null>();

    const { floatingStyles } = useFloating(
      toRef(props, 'target'), //
      popoverEl,
      {
        placement: toRef(props, 'position'),
        open: computed(() => props.visible),
        strategy: 'fixed',
        // If we use transform: true, animation that uses transform property will be broken.
        transform: false,
        whileElementsMounted(target, popover, update) {
          if (props.fixed) {
            update();
            return NOOP;
          }

          return autoUpdate(target, popover, update, {
            ancestorResize: true,
            ancestorScroll: true,
            elementResize: true,
          });
        },
        middleware: computed<Middleware[]>(() => {
          const middlewares = [attrs] as Middleware[];

          if (typeof props.gap === 'number' && props.gap !== 0) middlewares.push(offset(props.gap));
          if (!props.noFlip) middlewares.push(flip());
          if (props.syncSize) middlewares.push(syncSize);
          if (!props.canLeaveViewport) middlewares.push(shift({ crossAxis: true }));

          return middlewares;
        }),
      },
    );

    watch(popoverEl, (el) => {
      emit('update:el', el);
    });

    const popoverClosable = ref(false);
    const popoverVisible = computed(() => isElement(props.target) && props.visible);

    const close = () => {
      if (!props.visible) return;

      if (popoverClosable.value) {
        emit('update:visible', false);
      }
    };

    onBeforeUnmount(close);

    const handleWindowClick = (e: MouseEvent) => {
      // We should not call this function if Wowerlay is not visible
      // or has no target element etc.
      if (
        !props.visible ||
        !(props.target instanceof HTMLElement) ||
        // This check is for TypeScript, TypeScript doesn't think e.target is HTMLElement
        !(e.target instanceof HTMLElement) ||
        // This simulates `stopPropagation` but do not block event bubbling
        e.target.closest(STOP_ATTR_QUERY)
      ) {
        return;
      }

      const scopeEl = e.target.closest(SCOPE_ATTR_QUERY);

      // If scope element exists but it isn't our Wowerlay's scope we just return.
      if (scopeEl && !scopeEl.contains(props.target)) {
        return;
      }

      // If a Wowerlay background is clicked but it isn't our background, we don't close.
      // This enables nested Wowerlays to work properly
      // @see Demo/Nested
      if (e.target.matches('[data-wowerlay-background]') && e.target !== backgroundEl.value) {
        return;
      }

      close();
    };

    onMounted(() => {
      window.addEventListener('click', handleWindowClick);
    });
    onBeforeUnmount(() => {
      window.removeEventListener('click', handleWindowClick);
    });

    const backgroundVisible = ref(props.visible);

    watch(
      () => props.visible,
      (state) => {
        if (state) {
          setTimeout(() => {
            popoverClosable.value = true;
          }, 0);

          backgroundVisible.value = true;
        } else {
          popoverClosable.value = false;
          if (props.transition === false) {
            setTimeout(() => {
              backgroundVisible.value = false;
            });
          }
        }
      },
    );

    const handleContentTransitionEnd = () =>
      setTimeout(() => {
        backgroundVisible.value = false;
      });

    return {
      handleContentTransitionEnd,
      floatingStyles,
      popoverVisible,
      backgroundEl,
      popoverEl,
      backgroundVisible,
    };
  },
  render() {
    const popover = this.popoverVisible ? (
      <div
        class={cWowerlay}
        data-wowerlay-scope
        ref="popoverEl"
        style={this.floatingStyles}
        {...this.$attrs}
      >
        {this.$slots.default?.()}
      </div>
    ) : null;

    let wowerlayContentToRender: JSX.Element | null = (
      <Transition
        appear
        enterActiveClass={cWowerlayAnimEnter}
        leaveActiveClass={cWowerlayAnimLeave}
        onAfterLeave={this.handleContentTransitionEnd}
      >
        {popover}
      </Transition>
    );

    // We need it to be exactly `false` otherwise we use default transition.
    if (this.transition === false) {
      wowerlayContentToRender = popover;
    } else if (typeof this.transition === 'string') {
      wowerlayContentToRender = (
        <Transition appear onAfterLeave={this.handleContentTransitionEnd} name={this.transition}>
          {popover}
        </Transition>
      );
    }

    const backgroundAttrsClone = Object.assign(Object.create(null), this.backgroundAttrs);
    delete backgroundAttrsClone.key;

    return (
      <Teleport to="body">
        {(() => {
          if (this.noBackground) return wowerlayContentToRender;

          if (this.backgroundVisible) {
            return (
              <div
                data-wowerlay-background
                class={cWowerlayBackground}
                role="dialog"
                ref="backgroundEl"
                {...backgroundAttrsClone}
              >
                {wowerlayContentToRender}
              </div>
            );
          }

          return null;
        })()}
      </Teleport>
    );
  },
});
