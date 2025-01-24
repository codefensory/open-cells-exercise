import { plugCellsCore } from '@open-cells/core-plugin';
import { ReactiveControllerHost } from 'lit';

const channelControllerSymbol = Symbol('channelController');

export type PublishChannel<T = any> = (value?: T) => void;

class ChannelController {
  subscribe: any;
  unsubscribe: any;
  publish: any;

  constructor(host: ReactiveControllerHost) {
    plugCellsCore(this);

    this.subscribe = this.subscribe.bind(host);
    this.unsubscribe = this.unsubscribe.bind(host);
    this.publish = this.publish.bind(host);
  }
}

export function channel(
  ch: string,
  options?: { mode?: 'in' | 'out' | 'both'; skipUpdate?: boolean },
) {
  return (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => {
    const originalConnectedCallback = target.connectedCallback;

    target.connectedCallback = function () {
      const channelController: ChannelController =
        this[channelControllerSymbol] ??
        (this[channelControllerSymbol] = new ChannelController(this));

      if (originalConnectedCallback) {
        originalConnectedCallback.call(this);
      }

      if (descriptor) {
        const actionHandler = descriptor.value.bind(this);

        channelController.subscribe(ch, actionHandler);

        return;
      }

      let mode = options?.mode ?? 'both';

      let input = mode === 'in' || mode === 'both';

      let output = mode === 'out' || mode === 'both';

      let internalValue: any = this[propertyKey];

      Object.defineProperty(this, propertyKey, {
        get() {
          return internalValue;
        },
        set(value: any) {
          internalValue = value;

          if (output) {
            channelController.publish(ch, value);
          }
        },
      });

      if (input) {
        channelController.subscribe(ch, (value: any) => {
          internalValue = value;

          if (!options?.skipUpdate) {
            this.requestUpdate();
          }
        });
      }
    };

    const originaldisconnectedCallback = target.disconnectedCallback;

    target.disconnectedCallback = function () {
      if (originaldisconnectedCallback) {
        originaldisconnectedCallback.call(this);
      }

      const channelController = this[channelControllerSymbol];

      channelController.unsubscribe(ch);
    };
  };
}

export function publishChannel(ch: string) {
  return (target: any, propertyKey: string) => {
    const originalConnectedCallback = target.connectedCallback;

    target.connectedCallback = function () {
      const channelController: ChannelController =
        this[channelControllerSymbol] ??
        (this[channelControllerSymbol] = new ChannelController(this));

      if (originalConnectedCallback) {
        originalConnectedCallback.call(this);
      }

      Object.defineProperty(this, propertyKey, {
        get() {
          return (value: any) => channelController.publish(ch, value);
        },
        configurable: true,
        enumerable: true,
      });
    };
  };
}
