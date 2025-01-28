import { fixture, expect } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { AuthController } from './AuthController';

class TestElement extends LitElement {
  authController = new AuthController(this);
}

customElements.define('test-element', TestElement);

describe('AuthController', () => {
  it('should initialize with undefined authentication status', async () => {
    localStorage.clear();

    const el = await fixture<TestElement>(html`<test-element></test-element>`);

    expect(el.authController.isAuthenticate).to.be.undefined;
  });
});
