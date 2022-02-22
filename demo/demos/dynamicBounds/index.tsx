import { CSSProperties, defineComponent, ref, watch } from 'vue';

import { defineDemo, html } from '../../helpers';
import { Wowerlay } from '../../../src/lib';
import useDemoState from '../../helpers/useDemoState';

const fruits = ['Banana', 'Apple', 'Strawberry', 'Orange', 'Peach', 'Pear', 'Apricot'];
const searchFruit = (name: string) => {
  return fruits.filter((fruitName) => {
    return fruitName.trim().toLowerCase().includes(name.toLowerCase());
  });
};

const sFruitItem: CSSProperties = {
  width: '100%',
  padding: '5px',
};

const sFruitInput: CSSProperties = {
  padding: '5px',
  marginBottom: '5px',
};

const Component = defineComponent({
  name: 'DynamicBounds',
  setup() {
    const { targetEl, isOpen, handleVisibleChange, toggleVisible } = useDemoState();

    const fruitQuery = ref('');
    const input = ref<HTMLElement>();

    watch(
      isOpen,
      () => {
        input.value?.focus();
      },
      { flush: 'post' },
    );

    return {
      isOpen,
      targetEl,
      fruitQuery,
      input,
      handleVisibleChange,
      toggleVisible,
    };
  },
  render() {
    return (
      <>
        <span style="color: white">
          This only works if your browser supports{' '}
          <a
            target="_blank"
            href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#browser_compatibility"
            rel="noreferrer"
          >
            ResizeObserver
          </a>
        </span>

        <br />
        <br />

        <button type="button" onClick={this.toggleVisible} ref="targetEl">
          Click to Show Popover
          <Wowerlay
            onUpdate:visible={this.handleVisibleChange}
            visible={this.isOpen}
            target={this.targetEl}
            position="top"
          >
            <div style="max-width: 300px">
              <input
                ref="input"
                style={sFruitInput}
                v-model={this.fruitQuery}
                placeholder="Search for fruits"
                type="text"
              />
              {searchFruit(this.fruitQuery).map((name) => (
                <div style={sFruitItem}>{name}</div>
              ))}
            </div>
          </Wowerlay>
        </button>
      </>
    );
  },
});

export default defineDemo({
  name: 'Dynamic Bounds',
  component: Component,
  /* prettier-ignore */
  template: html`
    <template>
      <button @click="visible = !visible" ref="target">
        Click To Trigger Popover

        <Wowerlay
          fixed
          style="max-width: 300px"
          v-model:visible="visible"
          :target="target"
        >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum quam, qui asperiores,
            sed ipsa fuga, repellendus officiis labore odit temporibus quisquam necessitatibus? Illo
            vitae quis reprehenderit sequi quae iste, fuga quasi atque et voluptatibus. Debitis,
            facere, libero voluptate tempore omnis voluptas corporis fugiat sequi quidem cumque
            quisquam exercitationem a doloribus.
        </Wowerlay>
      </button>
    </template>
  `,
  script: html`
    <script setup>
      import { ref } from 'vue';

      const visible = ref(false);
      const target = ref();
    </script>
  `,
});
