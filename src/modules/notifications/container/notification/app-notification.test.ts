import { expect, fixture } from '@open-wc/testing';
import { AppNotification } from './app-notification';
import { html } from 'lit';

describe('AppNotification', () => {
  let element: AppNotification;

  beforeEach(async () => {
    element = await fixture(html`<app-notification></app-notification>`);
  });

  it('should be defined', () => {
    expect(element).to.be.instanceOf(AppNotification);
  });

  it('should render empty when no alerts', () => {
    expect(element.shadowRoot?.querySelector('.alerts')).to.be.null;
  });

  it('should show notification in DOM when handleAlert is called', done => {
    const targetElement = document.createElement('div');

    element.handleAlert({
      element: targetElement,
      message: 'Test message',
      variant: 'info',
    });

    element.updateComplete
      .then(() => {
        const alertsContainer = element.shadowRoot!.querySelector('.alerts');
        const toast = alertsContainer?.querySelector('sp-toast');

        expect(alertsContainer).to.exist;
        expect(toast).to.exist;
        expect(toast?.getAttribute('variant')).to.equal('info');
        expect(toast?.innerHTML).to.contain('Test message');

        done();
      })
      .catch(done);
  });

  it('should increment count when multiple alerts for same target', done => {
    const targetElement = document.createElement('div');

    element.handleAlert({
      element: targetElement,
      message: 'Test message',
      variant: 'info',
    });

    element.handleAlert({
      element: targetElement,
      message: 'Test message',
      variant: 'info',
    });

    element.updateComplete
      .then(() => {
        const toast = element.shadowRoot!.querySelector('sp-toast');

        expect(toast?.textContent?.trim()).to.include('(2 alerts)');

        done();
      })
      .catch(done);
  });

  it('should show notification in DOM when handleAlert is called', done => {
    const targetElement = document.createElement('div');

    element.handleAlert({
      element: targetElement,
      message: 'Test message',
      variant: 'warning',
    });

    element.updateComplete
      .then(() => {
        const alertsContainer = element.shadowRoot!.querySelector('.alerts');
        const toast = alertsContainer?.querySelector('sp-toast');

        expect(toast).to.exist;
        expect(toast?.getAttribute('variant')).to.equal('warning');

        done();
      })
      .catch(done);
  });

  it('should show notification in DOM when handleAlert is called', done => {
    const targetElement = document.createElement('div');

    element.handleAlert({
      element: targetElement,
      message: 'Test message',
      variant: 'warning',
    });

    element.updateComplete
      .then(() => {
        const alertsContainer = element.shadowRoot!.querySelector('.alerts');
        const toast = alertsContainer?.querySelector('sp-toast');

        expect(toast).to.exist;

        toast?.dispatchEvent(new CustomEvent('close'));

        element.updateComplete
          .then(() => {
            const alertsBefore = element.shadowRoot!.querySelector('.alerts');

            expect(alertsBefore).to.not.exist;

            done();
          })
          .catch(done);
      })
      .catch(done);
  });

  it('should show multiple notifications for different targets', done => {
    const targetElement1 = document.createElement('div');
    const targetElement2 = document.createElement('div');

    element.handleAlert({
      element: targetElement1,
      message: 'Message 1',
      variant: 'info',
    });

    element.handleAlert({
      element: targetElement2,
      message: 'Message 2',
      variant: 'negative',
    });

    setTimeout(() => {
      const toasts = element.shadowRoot!.querySelectorAll('sp-toast');

      expect(toasts.length).to.equal(2);

      expect(toasts[0].textContent?.trim()).to.contain('Message 1');

      expect(toasts[1].textContent?.trim()).to.contain('Message 2');

      done();
    });
  });
});
