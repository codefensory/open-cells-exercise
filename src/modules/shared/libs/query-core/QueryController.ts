import { ReactiveController, ReactiveControllerHost } from 'lit';
import { queryClient } from './queryClient';
import { QueryObserver, QueryObserverResult } from '@tanstack/query-core';

type Keys = Array<string | number>;

type QueryKeys = (() => Keys) | Keys;

type StatusRender<T> = {
  pending?: () => any;
  error?: (error: Error) => any;
  success?: (data: T) => any;
  initial?: () => any;
};

export class QueryController<T> implements ReactiveController {
  public data?: T;
  public status?: QueryObserverResult['status'];

  private observer!: QueryObserver<T, Error, T, T, Keys>;

  private get keys() {
    return typeof this.getKeys === 'function' ? this.getKeys() : this.getKeys;
  }

  constructor(
    private host: ReactiveControllerHost,
    private getKeys: QueryKeys,
    private fetcher: (options: { queryKey: Keys }) => Promise<T>,
  ) {
    host.addController(this);
  }

  render(statuses: StatusRender<T>) {
    const result = this.observer.getCurrentResult();

    this.data = result.data;
    this.status = result.status;

    switch (result.status) {
      case 'error':
        return statuses.error?.(new Error());
      case 'pending':
        return statuses.pending?.();
      case 'success':
        return statuses.success?.(result.data);
      default:
        return statuses.initial?.();
    }
  }

  hostConnected(): void {
    this.observer = new QueryObserver(queryClient, {
      queryKey: this.keys,
      queryFn: this.fetcher,
    });

    this.observer.subscribe(result => {
      this.data = result.data;
      this.status = result.status;

      this.host.requestUpdate();
    });
  }

  hostUpdate(): void {
    this.observer.setOptions({
      queryKey: this.keys,
      queryFn: this.fetcher,
    });
  }

  hostDisconnected(): void {
    this.observer.destroy();
  }
}
