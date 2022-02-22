import { defineComponent, ref } from 'vue';

import { Wowerlay, WowerlayProps } from '../../../src/lib';
import { defineDemo, html } from '../../helpers';
import useDemoState from '../../helpers/useDemoState';

const Component = defineComponent({
  name: 'Position',
  setup() {
    const position = ref('bottom' as WowerlayProps['position']);

    return {
      ...useDemoState(),
      position,
    };
  },
  render() {
    return (
      <div
        style={{
          display: 'inline-block',
          margin: '0 auto',
        }}
      >
        <select v-model={this.position} placeholder="Select Position">
          <option value="left">Left</option>
          <option value="left-start">Left Start</option>
          <option value="left-end">Left End</option>
          <option value="right">Right</option>
          <option value="right-start">Right Start</option>
          <option value="right-end">Right End</option>
          <option value="top">Top</option>
          <option value="top-start">Top Start</option>
          <option value="top-end">Top End</option>
          <option value="bottom">Bottom</option>
          <option value="bottom-start">Bottom Start</option>
          <option value="bottom-end">Bottom End</option>
        </select>
        <br />
        <br />

        <div style={{ color: 'white' }}>
          position: <strong>{this.position}</strong>
        </div>

        <br />
        <button type="button" onClick={this.toggleVisible} ref="targetEl">
          Click to Show Popover
          <Wowerlay
            onUpdate:visible={this.handleVisibleChange}
            visible={this.isOpen}
            target={this.targetEl}
            position={this.position}
          >
            <div style="max-width: 300px">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum quam, qui asperiores,
              sed ipsa fuga, repellendus officiis labore odit temporibus quisquam necessitatibus?
              Illo vitae quis reprehenderit sequi quae iste, fuga quasi atque et voluptatibus.
              Debitis, facere, libero voluptate tempore omnis voluptas corporis fugiat sequi quidem
              cumque quisquam exercitationem a doloribus.
            </div>
          </Wowerlay>
        </button>
      </div>
    );
  },
});

export default defineDemo({
  name: 'Position',
  component: Component,
  /* prettier-ignore */
  template: html`
    <template>
      <button @click="visible = !visible" ref="target">
        Click To Trigger Popover

        <Wowerlay 
          style="max-width: 300px"
          position="left"
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
